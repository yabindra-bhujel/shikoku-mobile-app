import os
import requests
import urllib.parse
from bs4 import BeautifulSoup

# Function to download links from a base URL
def download_links(base_url: str) -> set[str]:
    url_set = set()

    exclude_urls = {
        "https://www.youtube.com/channel/UCm5ahBUk9GaqUdx79eR6tLQ",
        "https://officewww2.shikoku-u.ac.jp/portal/",
        "https://shikoku-u.manaba.jp/ct/login",
        "https://www.shikoku-u.ac.jp/press/",
        "https://page.line.me/shikopon"
    }

    response = requests.get(base_url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']

            # Exclude undesired links
            if (href.endswith(".pdf") or href.startswith("tel:") or
                href == "/" or href.startswith("#") or
                href in exclude_urls or
                href in ["/english/", "/chinese/", "/vietnam/"]):
                continue

            url_set.add(href)

    return url_set

# Function to convert relative links to full URLs
def get_full_url(base_url: str) -> list[str]:
    qualified_links = []

    links = download_links(base_url)

    for link in links:
        if link:
            qualified_url = link if link.startswith(('http://', 'https://')) else urllib.parse.urljoin(base_url, link)
            qualified_links.append(qualified_url)

    return qualified_links

# Function to get sublinks from a URL
def get_sublinks(url: str) -> list[str]:
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        links = [a.get('href') for a in soup.find_all('a', href=True)]
        full_links = [urllib.parse.urljoin(url, link) for link in links]
        return full_links
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return []

# Base URLs
base_urls = [
    "https://www.shikoku-u.ac.jp/admissions/q-a/",
    "https://www.shikoku-u.ac.jp/guardian/",
    "https://www.shikoku-u.ac.jp/admissions/tour/",
    "https://www.shikoku-u.ac.jp/about/information/accredit/",
    "https://www.shikoku-u.ac.jp/internal/TELMAIL/",
    "https://www.shikoku-u.ac.jp/site-policy/",
    "https://docs.google.com/forms/d/e/1FAIpQLSekSZMGYvexUTFf_yyQkkW2BCGCUYeczvzEmAh1V6tgSpSWQg/viewform",
    "https://www.shikoku-u.ac.jp/international/",
    "http://www2.shikoku-u.ac.jp/jimu/keiri/",
    "https://www.shikoku-u.ac.jp/internal/covid19/",
    "https://www.shikoku-u.ac.jp/sitemap/",
    "https://www.shikoku-u.ac.jp/admissions/",
    "https://edu.career-tasu.jp/p/digital_pamph/frame.aspx?id=7542000-3-116&FL=0",
    "http://www2.shikoku-u.ac.jp/jimu/hokenkanri/",
    "http://www2.shikoku-u.ac.jp/jimu/g-unei/gakunai/",
    "http://www2.shikoku-u.ac.jp/jimu/j-kouhou/",
    "https://www.shikoku-u.ac.jp/public/",
    "https://www.shikoku-u.ac.jp/students/",
    "https://www.shikoku-u.ac.jp/contact/",
    "http://www2.shikoku-u.ac.jp/jimu/soumu/",
    "http://www2.shikoku-u.ac.jp/jimu/g-unei/gakunai/kakenhi/news.html",
    "https://www.shikoku-u.ac.jp/request/",
    "http://www2.shikoku-u.ac.jp/jimu/shien/intra/",
    "https://www.shikoku-u.ac.jp/admissions/opencampus/",
    "https://www.shikoku-u.ac.jp/outside/",
    "https://www.shikoku-u.ac.jp/cooperation/",
    "https://www.shikoku-u.ac.jp/education/",
    "https://en1-jg.d1-law.com/cgi-bin/shikoku-u/d1w_startup.exe",
    "http://www2.shikoku-u.ac.jp/maildirectory/",
    "http://www2.shikoku-u.ac.jp/zengaku-kk-center/g_nai/gakunai.html",
    "http://www2.shikoku-u.ac.jp/jimu/sisetu/",
    "https://www.shikoku-u.ac.jp/admissions/consult/",
    "https://www.shikoku-u.ac.jp/internal/",
    "https://www.shikoku-u.ac.jp/about/",
    "https://www.shikoku-u.ac.jp/asasuma/",
    "https://www.shikoku-u.ac.jp/company/",
    "http://www2.shikoku-u.ac.jp/jimu/nyushi/",
    "https://www2.shikoku-u.ac.jp/jimu/s-kikaku/in/kaikaku2023/index.html",
    "https://www.shikoku-u.ac.jp/admissions/WEB/",
    "https://lib.shikoku-u.ac.jp/",
    "https://www.shikoku-u.ac.jp/prestudents/",
    "http://www2.shikoku-u.ac.jp/jimu/s-kikaku/in/sogokikaku",
    "http://www2.shikoku-u.ac.jp/jimu/kyoumu/gaku_nai/",
    "https://www.shikoku-u.ac.jp/graduate/",
    "https://www.shikoku-u.ac.jp/about/access/",
    "https://www.shikoku-u.ac.jp/campus-life/",
    "https://www.shikoku-u.ac.jp/academics/",
    "https://www.shikoku-u.ac.jp/careers/",
    "https://www.shikoku-u.ac.jp/institution/",
    "https://www.shikoku-u.ac.jp/admissions/seminar/",
    "http://www2.shikoku-u.ac.jp/jimu/system/",
    "http://www2.shikoku-u.ac.jp/jimu/soumu/tekisei/index.html",
    "https://www.shikoku-u.ac.jp/privacy/",
    "http://www2.shikoku-u.ac.jp/jimu/senryaku/",
    "https://www.shikoku-u.ac.jp/100th/"
]

# Collecting sublinks for all base URLs
all_sublinks = {}
for base_url in base_urls:
    full_urls = get_full_url(base_url)
    for url in full_urls:
        all_sublinks[url] = get_sublinks(url)

# Print all sublinks
for url, sublinks in all_sublinks.items():
    print(f"URL: {url}")
    for sublink in sublinks:
        print(f"  Sublink: {sublink}")
