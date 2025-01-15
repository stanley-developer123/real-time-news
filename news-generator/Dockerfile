FROM python:3.11-slim

WORKDIR /app
COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

ENV OPENAI_API_KEY="5590093627:AAFCXSDZjQ864Rqz963C-9TNnI_u5X8hCqE"

CMD ["python", "generator.py"]
