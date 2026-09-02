from flask import Flask, render_template, request

# Исправлено: два подчеркивания с каждой стороны
app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def home():
    greeting = ""
    if request.method == "POST":
        name = request.form.get("username")

        if name:
            if name.lower().startswith("a"):
                greeting = "Hello guest"
            else:
                greeting = f"Hello {name}"

    return render_template("dex.html", greeting=greeting)


# Исправлено: два подчеркивания с каждой стороны
if __name__ == "__main__":
    app.run(debug=True)
