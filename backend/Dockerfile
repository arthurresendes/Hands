FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# main.py importa "core", "routers"... como módulos de topo, então o
# diretório "app" precisa estar no path (--app-dir) e o módulo é "main:app".
CMD ["uvicorn", "main:app", "--app-dir", "app", "--host", "0.0.0.0", "--port", "8000"]