from django.shortcuts import render, redirect

import re
import random

from . import util

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })
    
def entry(request, title):
    content = util.get_entry(title)
    if content is None:
        return render(request, "encyclopedia/error.html", {
            "message": "Page not found."
        })

    return render(request, "encyclopedia/entry.html", {
        "title": title,
        "content": convert_markdown_to_html(content)
    })
    
def edit(request, title):
    return render(request, "encyclopedia/error.html", {
        "message": f"Edit page for '{title}' not implemented yet."
    })

def search(request):
    query = request.GET.get("q", "")
    entries = util.list_entries()

    if query.lower() in [entry.lower() for entry in entries]:
        # Точное совпадение — перенаправляем
        for entry in entries:
            if entry.lower() == query.lower():
                return redirect("entry", title=entry)

    # Подстрочные совпадения
    results = [entry for entry in entries if query.lower() in entry.lower()]

    return render(request, "encyclopedia/search.html", {
        "query": query,
        "results": results
    })

def create(request):
    if request.method == "POST":
        title = request.POST.get("title")
        content = request.POST.get("content")

        # Проверка на дубликат
        existing_titles = [entry.lower() for entry in util.list_entries()]
        if title.lower() in existing_titles:
            return render(request, "encyclopedia/error.html", {
                "message": f"A page titled '{title}' already exists."
            })

        util.save_entry(title, content)
        return redirect("entry", title=title)

    return render(request, "encyclopedia/create.html")

def edit(request, title):
    if request.method == "POST":
        content = request.POST.get("content")
        util.save_entry(title, content)
        return redirect("entry", title=title)

    content = util.get_entry(title)
    if content is None:
        return render(request, "encyclopedia/error.html", {
            "message": "Page not found."
        })

    return render(request, "encyclopedia/edit.html", {
        "title": title,
        "content": content
    })
    
import random  # В начало файла

def random_page(request):
    entries = util.list_entries()
    if entries:
        title = random.choice(entries)
        return redirect("entry", title=title)
    return render(request, "encyclopedia/error.html", {
        "message": "No entries available."
    })
    
import re

def convert_markdown_to_html(markdown_text):
    lines = markdown_text.split("\n")
    html = []
    in_list = False

    for line in lines:
        line = line.strip()

        # Heading (e.g., # Title)
        if re.match(r"^#{1,6} ", line):
            level = len(re.match(r"^#{1,6}", line).group(0))
            text = line[level+1:]
            html.append(f"<h{level}>{text}</h{level}>")

        # Unordered list
        elif line.startswith("* "):
            if not in_list:
                html.append("<ul>")
                in_list = True
            html.append(f"<li>{line[2:]}</li>")

        else:
            if in_list:
                html.append("</ul>")
                in_list = False

            # Bold: **text**
            line = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", line)

            # Links: [text](url)
            line = re.sub(r"\[(.*?)\]\((.*?)\)", r'<a href="\2">\1</a>', line)

            # Paragraph
            if line:
                html.append(f"<p>{line}</p>")

    if in_list:
        html.append("</ul>")

    return "\n".join(html)
