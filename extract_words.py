import requests
from bs4 import BeautifulSoup

def get_last_page_number(soup):
    # Find the pagination section and extract the largest page number
    pages = soup.find_all('a', class_='pg')
    numbers = [int(a.text) for a in pages if a.text.isdigit()]
    if numbers:
        return max(numbers)
    # fallback: try to find the last page number in the text
    pg_text = soup.find('span', class_='pg')
    if pg_text:
        import re
        nums = re.findall(r'page(\d+)\.htm', soup.prettify())
        if nums:
            return max(map(int, nums))
    return 1

def extract_words_from_page(soup):
    span = soup.find('span', class_='mt')
    if span:
        return span.text.strip().split()
    return []

def fetch_words_for_length(word_length):
    base_url = f"https://www.listesdemots.net/mots{word_length}lettres"
    words = []
    # First page (no page number)
    url = f"{base_url}.htm"
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, 'html.parser')
    words += extract_words_from_page(soup)
    last_page = get_last_page_number(soup)
    # Other pages
    for page in range(2, last_page + 1):
        url = f"{base_url}page{page}.htm"
        resp = requests.get(url)
        soup = BeautifulSoup(resp.text, 'html.parser')
        words += extract_words_from_page(soup)
    return words

if __name__ == "__main__":
    for length in range(6, 22):
        print(f"Fetching {length}-letter words...")
        words = fetch_words_for_length(length)
        with open(f"mots{length}lettres.txt", "w", encoding="utf-8") as f:
            for word in words:
                f.write(word + "\n")
        print(f"Saved {len(words)} words for length {length}")
