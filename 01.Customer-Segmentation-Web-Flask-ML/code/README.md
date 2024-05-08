# Customer Segmentation with Flask Interface
This project utilizes the Mall Customers dataset to perform customer segmentation. The goal is to group customers based on their similarities and provide a user-friendly web interface using Flask.

The Mall Customers dataset includes information such as age, annual income, and spending score. The project preprocesses the data, applies the k-means clustering algorithm, and saves the segmentation model as a pickle file.

To use the project, ensure you have Python 3, Jupyter Notebook, Flask, Pandas, and Scikit-learn installed. Clone the repository, place the dataset file (mall_customers.csv) in the appropriate directory, and run the Jupyter notebook customer_segmentation.ipynb to generate the segmentation model as segmentation_model.pkl.

Afterward, run the Flask application by navigating to the project directory in the terminal and executing flask run. Access the web interface at http://localhost:5000, where you can explore the customer segments and view visualizations of the segmentation results.

Contributions to the project are welcome, and it is licensed under the MIT License.
