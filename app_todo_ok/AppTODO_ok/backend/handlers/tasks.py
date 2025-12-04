import tornado.escape
from bson import ObjectId
from backend.db import messaggi
from backend.handlers.auth import BaseHandler

from datetime import datetime
data_corrente = datetime.now()
stringa_formattata = data_corrente.strftime("%d/%m/%Y %H:%M:%S")


class MsgHandler(BaseHandler):
    async def get(self):
        user = self.get_current_user()
        if not user:
            return self.write_json({"error": "Non autenticato"}, 401)

        cursor = messaggi.find()
        out = []
        async for t in cursor:
            out.append({
                "id": str(t["_id"]),
                "text": t["text"],
                "date": t["date"],
                "done": t["done"]
            })

        return self.write_json({"items": out})

    async def post(self):
        user = self.get_current_user()
        if not user:
            return self.write_json({"error": "Non autenticato"}, 401)

        body = tornado.escape.json_decode(self.request.body)
        text = body.get("text", "").strip()

        if not text:
            return self.write_json({"error": "Testo obbligatorio"}, 400)

        result = await messaggi.insert_one({
            "user_id": ObjectId(user["id"]),
            "text": text,
            "date": stringa_formattata,
            "done": False
        })

        return self.write_json({"id": str(result.inserted_id)}, 201)


class MsgDeleteHandler(BaseHandler):
    async def delete(self, task_id):
        user = self.get_current_user()
        if not user:
            return self.write_json({"error": "Non autenticato"}, 401)

        await messaggi.delete_one({
            "_id": ObjectId(task_id),
            "user_id": ObjectId(user["id"])
        })

        return self.write_json({"message": "Eliminato"})
