import os
import requests
import urllib.parse
from bs4 import BeautifulSoup

def download_pdf_links(save_path: str, folder_name: str) -> None:
    urls = []
    with open('links.txt', 'r', encoding='utf-8') as f:
        for line in f:
            urls.append(line.strip())

    for url in urls:
        download_pdf_from_url(url, save_path, folder_name)

def download_pdf_from_url(url: str, save_path: str, folder_name: str) -> None:
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']

            # Handle relative paths
            if not href.startswith('http'):
                href = urllib.parse.urljoin(url, href)

            if href.endswith(".pdf"):
                download_pdf(href, save_path, folder_name)

def download_pdf(pdf_link: str, save_path: str, folder_name: str) -> None:
    response = requests.get(pdf_link)

    if response.status_code == 200:
        filename = os.path.basename(urllib.parse.urlsplit(pdf_link).path)
        folder_path = os.path.join(save_path, folder_name)

        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        file_path = os.path.join(folder_path, filename)

        with open(file_path, 'wb') as f:
            f.write(response.content)

        print(f"Downloaded {filename} successfully.")

    else:
        print(f"Failed to download {pdf_link}.")

if __name__ == '__main__':
    download_pdf_links(save_path="", folder_name="pdf_files")
