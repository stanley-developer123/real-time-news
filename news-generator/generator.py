# generator.py
import time
import json
import random
import pika
import datetime
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

CATEGORIES = ["Technology", "Business", "World", "Science"]
KEYWORDS = ["innovation", "stocks", "politics",
            "research", "climate", "ai", "economy"]


def generate_ai_content(category):
    """Generate a short news paragraph from an LLM about the given category."""
    prompt = f"Write a short 50-word news article about {category}."
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=100,
            temperature=0.7
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print("Error calling OpenAI:", e)
        return f"Default fallback content for {category}."


def generate_news_item():
    category = random.choice(CATEGORIES)
    title = f"{category} Update {random.randint(1, 1000)}"
    content = generate_ai_content(category)  # AI-generated content
    timestamp = datetime.datetime.utcnow().isoformat()
    keywords = random.sample(KEYWORDS, k=random.randint(1, len(KEYWORDS)))

    return {
        "title": title,
        "content": content,
        "category": category,
        "timestamp": timestamp,
        "keywords": keywords
    }


def main():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host='rabbitmq', port=5672, credentials=pika.PlainCredentials('guest', 'guest'))
    )
    channel = connection.channel()

    channel.exchange_declare(exchange='news_exchange', exchange_type='topic')
    routing_key = "news.items"

    try:
        while True:
            news_item = generate_news_item()
            channel.basic_publish(
                exchange='news_exchange',
                routing_key=routing_key,
                body=json.dumps(news_item)
            )
            print(f"[x] Sent news item: {news_item}")
            time.sleep(random.randint(5, 10))
    except KeyboardInterrupt:
        print("Shutting down news generator...")
    finally:
        connection.close()


if __name__ == "__main__":
    main()
