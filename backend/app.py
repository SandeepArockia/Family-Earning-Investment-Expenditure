import logging
import sqlite3
import pandas as pd
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def setup_logger(name, level=logging.DEBUG, force_add=False):
    """
    This function is used to setup logger, which can be used across the codebase.
    Parameters
    ----------
    name - name of the logger. Default is the file name in which it is being called.
    level - debugging level. Default is DEBUG level
    force_add - If a logger already exists, create a new one by force.

    Returns
    -------
    Logger Handle
    """
    logger = logging.getLogger(name)
    if len(logger.handlers) and not force_add:
        return logger
    logger.setLevel(level)
    ch = logging.StreamHandler()
    ch.setLevel(level)
    formatter = logging.Formatter(
        "%(asctime)s [ %(name)s ] %(levelname)s :  %(message)s"
    )
    ch.setFormatter(formatter)
    logger.addHandler(ch)
    return logger

LOGGER = setup_logger("dbinteraction")

class DBInteraction:

    def __init__(self,creds = None):
        self.creds = creds

    def get_connection(self):
        conn = sqlite3.connect(self.creds)
        return conn

    def create_table(self, table_name, column_type, primary_key='', constraints=''):
        cols = ','.join(['"' + i[0] + '" ' + i[1] for i in column_type])
        if primary_key:
            primary_key = ',PRIMARY KEY ({})'.format(','.join(primary_key))
        if constraints:
            constraints = ',' + ', \n'.join(constraints)

        table_cre_q = f"""CREATE TABLE main.{table_name} ({cols + primary_key + constraints});"""
        LOGGER.debug('Query Used')
        LOGGER.debug(table_cre_q)
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(table_cre_q)
        conn.commit()
        conn.close()

    def insert_records(self, table_name, data):
        data_upload = pd.DataFrame(data)
        data_upload = data_upload.replace(np.nan, None).astype(str)
        cols, data = data_upload.columns, list(map(list, data_upload.values))
        insert_dat_q = f"""INSERT INTO {table_name} ({'"' + '", "'.join(cols) + '"'}) VALUES({','.join(['%s'] * len(cols))}) """
        conn = self.get_connection()
        cur = conn.cursor()
        LOGGER.debug("Inserting {} records into table {}".format(len(data), table_name))
        cur.executemany(insert_dat_q, data)
        conn.commit()
        conn.close()

    def drop_table(self, table_name):
        delete_table_q = f"DROP TABLE {table_name};"
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(delete_table_q)
        conn.commit()
        conn.close()

    def delete_table_data(self, table_name):
        delete_table_q = f"DELETE FROM {table_name};"
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(delete_table_q)
        conn.commit()
        conn.close()

    def get_records(self, table_name):
        get_records_q = f"Select * FROM {table_name};"
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(get_records_q)
        data = cur.fetchall()
        cols = [i[0] for i in cur.description]
        data = [dict(zip(cols, i)) for i in data]
        conn.commit()
        conn.close()
        return data

    def get_tables(self):
        query = """SELECT name FROM sqlite_master WHERE type='table'"""
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(query)
        data = cur.fetchall()
        data = [i[0] for i in data]
        conn.commit()
        conn.close()
        return data

    def run_query(self, query, return_res=False):
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(query)
        if return_res:
            data = cur.fetchall()
            cols = [i[0] for i in cur.description]
            data = [dict(zip(cols, i)) for i in data]
            conn.commit()
            conn.close()
            return data
        conn.commit()
        conn.close()

    def create_sequence(self, seq_name):
        self.run_query(f"CREATE SEQUENCE {seq_name};")
        return True

    def add_sequence(self, table_name, seq_col_name, seq_name):
        query = f"""Alter table {table_name}
                    ADD column {seq_col_name} bigint NOT NULL DEFAULT nextval('{seq_name}');"""
        self.run_query(query)
        return True
tab_dict = {
    'family':{'f_name':'TEXT','l_name':'TEXT','dob':'TEXT','pan':'TEXT','aadhar':'INTEGER','dependent':'TEXT'},
    'earning':{'f_name':'TEXT','date':'TEXT','source':'TEXT','account':'INTEGER','gross_amount':'REAL','tax_amount':'REAL','net_amount':'REAL'},
    'investment':{'f_name':'TEXT','date':'TEXT','type':'TEXT','sub_type':'TEXT','amount_invested':'REAL','account':'REAL'},
    'expenditure':{'f_name':'TEXT','date':'TEXT','account_type':'TEXT','sub_type':'TEXT','amount':'REAL','mode_of_payment':'REAL'},
    'bank_account':{'f_name':'TEXT','account':'INTEGER','name_of_bank_firm':'TEXT','branch':'TEXT','bank_phone':'INTEGER'},
    'loan':{'f_name':'TEXT','type':'TEXT','account':'INTEGER','emi':'REAL','start_date':'TEXT','end_date':'TEXT','rate_of_interest':'REAL'},
    'transaction_d':{'account':'INTEGER','date':'TEXT','transaction_type':'TEXT','type':'TEXT','subtype':'TEXT','amount':'REAL','mode_of_payment':'TEXT','balance':'REAL'}
}

a=[{
    'id': 1,
    'accountNo': "1111111111111111",
    'subtype': "1",
    'type': "Earning",
    'amount': "1",
    'mode': "Cash",
    'date': "2021-10-06"
  },
  {
    'id': 2,
    'accountNo': "123334456765432",
    'subtype': "q",
    'type': "Earning",
    'amount': "1",
    'mode': "Cash",
    'date': "2021-10-06",
  },
  {
    'id': 3,
    'accountNo': "1234567654323",
    'subtype': "w",
    'type': "Expenditure",
    'amount': "1",
    'mode': "Card",
    'date': "2021-10-06",
  },
  {
    'id': 4,
    'accountNo': "41234567643",
    'subtype': "e",
    'type': "Investments",
    'amount': "1",
    'mode': "Cheque",
    'date': "2021-10-06",
  },
  {
    'id': 5,
    'accountNo': "123456754325",
    'subtype': "r",
    'type': "Loan Payment",
    'amount': "1",
    'mode': "Account",
    'date': "2021-10-06",
  }
]
@app.route("/transactions",methods=["GET"])
def get_all_transactions():
    # need = DBInteraction("pro_data.db")
    # all_records = need.get_records('transaction_d')
    return str(a)

@app.route("/transaction",methods=['POST'])
def post_transactionns():
    print('inserting records')
    return 'ok'

@app.route('/transaction/<id>', methods=['PUT'])
def put_transaction():
    print('putting records')
    return 'ok'

@app.route('/transaction/<id>',methods=['DELETE'])
def delete_transaction():
    print('delete records')
    return 'ok'
#create all table using the above dicts
# for i, j in tab_dict.items():
#     need = DBInteraction('pro_data.db')
#     need.create_table(table_name=i, column_type=list(j.items()))

if __name__ == "__main__":
    app.run(debug=True, port=8000)
