from pymongo import MongoClient
from secretes.secrets import MONGO_DB_CONNECTION




def get_Client():
    client = MongoClient(MONGO_DB_CONNECTION,
                          tls=True,
    tlsAllowInvalidCertificates=True) 
    return client