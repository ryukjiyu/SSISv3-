from flask_mysql_connector import MySQL

mysql = MySQL()

def college_list():
    cursor = mysql.connection.cursor(dictionary=True)
    query = "SELECT * FROM colleges"
    cursor.execute(query)
    colleges = cursor.fetchall()
    cursor.close()
    return colleges
    
    