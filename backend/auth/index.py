"""Авторизация: регистрация, вход, выход, проверка сессии."""
import json
import os
import hashlib
import secrets
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    path = event.get("path", "/")
    method = event.get("httpMethod", "GET")
    body = json.loads(event.get("body") or "{}")
    headers = event.get("headers") or {}
    token = headers.get("x-session-token") or headers.get("X-Session-Token", "")

    conn = get_conn()
    cur = conn.cursor()

    # POST /register
    if method == "POST" and path.endswith("/register"):
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        name = (body.get("name") or "").strip()

        if not email or not password or not name:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все поля"})}

        if len(password) < 6:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Email уже зарегистрирован"})}

        pw_hash = hash_password(password)
        cur.execute(
            "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
            (email, pw_hash, name)
        )
        user_id = cur.fetchone()[0]

        new_token = secrets.token_hex(32)
        cur.execute("INSERT INTO sessions (token, user_id) VALUES (%s, %s)", (new_token, user_id))
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"token": new_token, "user": {"id": user_id, "email": email, "name": name}})
        }

    # POST /login
    if method == "POST" and path.endswith("/login"):
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Введите email и пароль"})}

        pw_hash = hash_password(password)
        cur.execute("SELECT id, name, email FROM users WHERE email = %s AND password_hash = %s", (email, pw_hash))
        row = cur.fetchone()

        if not row:
            conn.close()
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

        user_id, name, user_email = row
        new_token = secrets.token_hex(32)
        cur.execute("INSERT INTO sessions (token, user_id) VALUES (%s, %s)", (new_token, user_id))
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"token": new_token, "user": {"id": user_id, "email": user_email, "name": name}})
        }

    # GET /me
    if method == "GET" and path.endswith("/me"):
        if not token:
            conn.close()
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Нет сессии"})}

        cur.execute(
            "SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = %s",
            (token,)
        )
        row = cur.fetchone()
        conn.close()

        if not row:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия не найдена"})}

        user_id, email, name = row
        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"user": {"id": user_id, "email": email, "name": name}})
        }

    # POST /logout
    if method == "POST" and path.endswith("/logout"):
        if token:
            cur.execute("UPDATE sessions SET user_id = user_id WHERE token = %s", (token,))
            cur.execute("DELETE FROM sessions WHERE token = %s", (token,))
            conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}
