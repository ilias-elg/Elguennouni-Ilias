import requests

with open('cv.tex', 'r', encoding='utf-8') as f:
    tex_data = f.read()

files = {
    'filecontents[]': ('cv.tex', tex_data)
}
data = {
    'filename[]': 'cv.tex',
    'engine': 'pdflatex',
    'return': 'pdf'
}

try:
    response = requests.post('https://texlive.net/cgi-bin/latexcgi', files=files, data=data)
    print("Status:", response.status_code)
    print("Content-Type:", response.headers.get('Content-Type'))
    if response.status_code == 200:
        if 'application/pdf' in response.headers.get('Content-Type', ''):
            with open('cv.pdf', 'wb') as f:
                f.write(response.content)
            print("Saved cv.pdf")
        else:
            print("Response:", response.text[:500])
    else:
        print("Error:", response.text[:200])
except Exception as e:
    print("Exception:", e)
