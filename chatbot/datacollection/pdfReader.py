import os
import PyPDF2
import re

def pdfReader(file):
    # Open the pdf file
    pdfFileObj = open(file, 'rb')
    pdfReader = PyPDF2.PdfReader(pdfFileObj)  # Updated to PdfReader
    num_pages = len(pdfReader.pages)  # Updated to use the pages attribute
    count = 0
    text = ""
    # The while loop will read each page
    while count < num_pages:
        pageObj = pdfReader.pages[count]  # Updated to use the pages attribute
        count += 1
        text += pageObj.extract_text()
    # Close the pdf file
    pdfFileObj.close()
    return text

def extract_text_from_pdf(file):
    text = pdfReader(file)
    return text

# Replace 'data.pdf' with the path to your PDF file
data = extract_text_from_pdf('data.pdf')
print(data)
