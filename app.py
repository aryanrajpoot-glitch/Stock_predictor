from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    return jsonify({
        'current_price': 154.50,
        'predicted_price': 159.25,
        'recommendation': 'BUY'
    })

if __name__ == '__main__':
    app.run(debug=True)