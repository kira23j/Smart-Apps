from flask import Flask, request, render_template
import pickle
import sys

with open('kmeans_model.pkl', 'rb') as file:
    model = pickle.load(file)

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the input values from the form
    annual_income = float(request.form['annual_income'])
    spending_score = float(request.form['spending_score'])

    # Perform the prediction using the loaded model
    prediction = model.predict([[annual_income, spending_score]])

    # Map the cluster number to a label
    cluster_labels = {
        0: 'Average Income and Average Spending',
        1: 'High Income and Low Spending',
        2: 'Low Income and High Spending',
        3: 'Low Income and Low Spending',
        4: 'High Income and High Spending'
    }
    predicted_label = cluster_labels[prediction[0]]

    # Render the result template with the predicted cluster label
    return render_template('result.html', predicted_label=predicted_label)

@app.route('/exit')
def exit_app():
    sys.exit("Flask app is exiting")

if __name__ == '__main__':
 app.run(debug=True)

