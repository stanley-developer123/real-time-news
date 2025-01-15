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


def generate_local_news(category: str) -> str:
    """
    Generate a short fallback news article without using AI,
    just to cover any errors calling OpenAI.
    """
    # You can make this as simple or as advanced as you like.
    # This is just a stub example.
    lines = [
        f"{category} continues to make headlines as new developments unfold.",
        f"Experts in {category} are discussing the recent events that took place this week.",
        f"{category} experts suggest more changes could arrive by the end of the month.",
        f"Consumers interested in {category} will soon see the impact on everyday life."
    ]
    random.shuffle(lines)
    # Return the first line or combine a few lines
    return " ".join(lines[:2])


def generate_ai_content(category: str) -> str:
    """
    Generate a short news paragraph from an LLM about the given category.
    Falls back to local news generation if AI call fails.
    """
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
        # If AI generation fails, generate a local snippet
        return generate_local_news(category)



def generate_news_item():
    category = random.choice(CATEGORIES)
    title = f"{category} Update {random.randint(1, 1000)}"
    content = generate_ai_content(category)
    keywords = random.sample(KEYWORDS, k=random.randint(1, len(KEYWORDS)))

    return {
        "title": title,
        "content": content,
        "category": category,
        "timestamp": timestamp,
        "keywords": keywords
    }


def connect_to_rabbit():
    for attempt in range(10):
        try:
            return pika.BlockingConnection(
                pika.ConnectionParameters(
                    host='rabbitmq',
                    port=5672,
                    credentials=pika.PlainCredentials('guest', 'guest')
                )
            )
        except pika.exceptions.AMQPConnectionError:
            print(
                f"RabbitMQ not ready, retrying in 3s (attempt {attempt + 1})...")
            time.sleep(3)
    raise Exception("Could not connect to RabbitMQ after 10 attempts")


def main():
    connection = connect_to_rabbit()
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
