from flask import Flask, render_template, redirect, url_for
from flask_pymongo import PyMongo
from flask import jsonify
import json
from bson import json_util
import os



# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/project_1"
mongo = PyMongo(app)

#write a json file
def json_file(obj):
    with open("project_1", "w") as outfile:
        outfile.write(obj)
    # with open("project_1", "w") as outfile:
    #     json.dump(obj, outfile)


#Route for index.html
@app.route("/")
@app.route("/home")
@app.route("/index.html")
def home():
    return render_template("index.html")

#Route for line chart
@app.route("/line_chart")
@app.route("/line_chart.html")
def line_chart():
    return render_template("line_chart.html")

#Route for rader chart
@app.route("/radar_chart")
@app.route("/radar_chart.html")
def radar_chart():
    return render_template("radar_chart.html")

@app.route("/world_map")
@app.route("/world_map.html")
def world_map():
    return render_template("world_map.html")

#Route to show the data in the page
@app.route('/data')
@app.route('/data.html')
def data():
    project_1 = [doc for doc in mongo.db.collection.find()]
    return render_template("data.html", project_1 = project_1)
    
#Route to get the JSON data
@app.route('/getMyJson')
def getMyJson():
    project_1 = [doc for doc in mongo.db.collection.find()]
    return json_util.dumps(project_1)

if __name__ == "__main__":
    json_file(getMyJson())
    app.run(debug=True)