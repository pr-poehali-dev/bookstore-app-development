"""Управление корзиной и избранным пользователя."""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def get_user_id(cur, token: str):
    cur.execute(
        "SELECT user_id FROM sessions WHERE token = %s",
        (token,)
    )
    row = cur.fetchone()
    return row[0] if row else None

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    path = event.get("path", "/")
    method = event.get("httpMethod", "GET")
    body = json.loads(event.get("body") or "{}")
    headers = event.get("headers") or {}
    token = headers.get("x-session-token") or headers.get("X-Session-Token", "")

    if not token:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Требуется авторизация"})}

    conn = get_conn()
    cur = conn.cursor()

    user_id = get_user_id(cur, token)
    if not user_id:
        conn.close()
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия не найдена"})}

    # ─── CART ───────────────────────────────────────────────

    # GET /cart — получить корзину
    if method == "GET" and path.endswith("/cart"):
        cur.execute("SELECT book_id, qty FROM cart_items WHERE user_id = %s", (user_id,))
        items = [{"bookId": r[0], "qty": r[1]} for r in cur.fetchall()]
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"items": items})}

    # POST /cart/add — добавить или увеличить
    if method == "POST" and path.endswith("/cart/add"):
        book_id = body.get("bookId")
        qty = body.get("qty", 1)
        cur.execute(
            """INSERT INTO cart_items (user_id, book_id, qty) VALUES (%s, %s, %s)
               ON CONFLICT (user_id, book_id) DO UPDATE SET qty = cart_items.qty + EXCLUDED.qty""",
            (user_id, book_id, qty)
        )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # POST /cart/update — установить конкретное кол-во
    if method == "POST" and path.endswith("/cart/update"):
        book_id = body.get("bookId")
        qty = body.get("qty", 1)
        if qty <= 0:
            cur.execute("DELETE FROM cart_items WHERE user_id = %s AND book_id = %s", (user_id, book_id))
        else:
            cur.execute(
                """INSERT INTO cart_items (user_id, book_id, qty) VALUES (%s, %s, %s)
                   ON CONFLICT (user_id, book_id) DO UPDATE SET qty = EXCLUDED.qty""",
                (user_id, book_id, qty)
            )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # POST /cart/remove — удалить позицию
    if method == "POST" and path.endswith("/cart/remove"):
        book_id = body.get("bookId")
        cur.execute("DELETE FROM cart_items WHERE user_id = %s AND book_id = %s", (user_id, book_id))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # POST /cart/clear — очистить корзину
    if method == "POST" and path.endswith("/cart/clear"):
        cur.execute("DELETE FROM cart_items WHERE user_id = %s", (user_id,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # ─── FAVORITES ──────────────────────────────────────────

    # GET /favorites — получить избранное
    if method == "GET" and path.endswith("/favorites"):
        cur.execute("SELECT book_id FROM favorites WHERE user_id = %s", (user_id,))
        ids = [r[0] for r in cur.fetchall()]
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"bookIds": ids})}

    # POST /favorites/toggle — добавить/удалить из избранного
    if method == "POST" and path.endswith("/favorites/toggle"):
        book_id = body.get("bookId")
        cur.execute("SELECT id FROM favorites WHERE user_id = %s AND book_id = %s", (user_id, book_id))
        exists = cur.fetchone()
        if exists:
            cur.execute("DELETE FROM favorites WHERE user_id = %s AND book_id = %s", (user_id, book_id))
            added = False
        else:
            cur.execute("INSERT INTO favorites (user_id, book_id) VALUES (%s, %s)", (user_id, book_id))
            added = True
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "added": added})}

    conn.close()
    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}
