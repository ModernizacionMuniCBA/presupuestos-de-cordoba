"""
Transformar los CSV en varios JSON compatibles con el _Zoomable Treemap_ para diferentes gráficos.
"""

p17finalidad = "presupuesto-2017-por-finalidad-y-funcion.csv"
p17objeto = "presupuesto-2017-por-objeto-del-gasto.csv"

import csv
import json

fjson1 = []  # json final para grafico basado en secretarias para objeto del gasto
fjson2 = []  # json final para grafico basado en objeto del gasto para secretarías

with open(p17objeto) as csvfile:
    """ 
    Este archivo describe el presupuesto por objeto del Gasto y tienen un primer campo
    _Nivel_ que define la estructura jerárquica de los datos
    """
    reader = csv.DictReader(csvfile, delimiter=';', quotechar='"')
    
    
    detalle = {}  # detalle de la linea actual dentro de la estructura
    for row in reader:
        
        nivel = None if row['Nivel'] == "" else int(row['Nivel'])
        
        if nivel is not None:
            nombre = row["Nombre"].strip()
            if nombre.split()[0].isnumeric():
                nombre = " ".join(nombre.split()[1:])
            detalle[nivel] = nombre
            
            if nivel == 3:
                # iterar por todas las secretarías para tomar los datos
                for k in row.keys():
                    if k in ["Nivel", "Nombre", "Total"]:
                        continue
                    value = 0 if row[k] == "" else int(row[k])

                    # grafico por secretarías como nodos principal
                    linea = {"key": detalle[3], "region": k , "subregion": detalle[2], "value": value}
                    fjson1.append(linea)

                    # grafico con gastos de nivel 3 como princial
                    linea = {"key": k, "region": detalle[3], "value": value}
                    fjson2.append(linea)

    
f = open("presupuesto-por-secretarias-por-objeto.json", "w")
f.write(json.dumps(fjson1, indent=4, sort_keys=True))
f.close()

f = open("presupuesto-por-objeto-por-secretaria.json", "w")
f.write(json.dumps(fjson2, indent=4, sort_keys=True))
f.close()


fjson3 = []  # json final para grafico basado en secretarias para finalidad y funcion
fjson4 = []  # json final para grafico basado en finalidad y funcion para secretarias

with open(p17finalidad) as csvfile:
    """ 
    Este archivo describe el presupuesto por finalidad tienen un primer campo
    _Nivel_ que define la estructura jerárquica de los datos
    """
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    
    
    detalle = {}  # detalle de la linea actual dentro de la estructura
    for row in reader:
        
        nivel = None if row['Nivel'] == "" else int(row['Nivel'])
        
        if nivel is not None:
            nombre = row["Clasificación por finalidad y función"].strip()
            if nombre.split()[0].isnumeric():
                nombre = " ".join(nombre.split()[1:])
            detalle[nivel] = nombre
            
            if nivel == 2:
                # iterar por todas las secretarías para tomar los datos
                for k in row.keys():
                    if k in ["Nivel", "Clasificación por finalidad y función", "Total"]:
                        continue
                    value = 0 if row[k] == "" else int(row[k])

                    # grafico por secretarías como nodos principal
                    linea = {"key": detalle[2], "region": k, "value": value}
                    fjson3.append(linea)

                    # grafico con gastos de nivel 3 como princial
                    linea = {"key": k, "region": detalle[2], "value": value}
                    fjson4.append(linea)

    
f = open("presupuesto-por-secretarias-por-finalidad.json", "w")
f.write(json.dumps(fjson3, indent=4, sort_keys=True))
f.close()

f = open("presupuesto-por-finalidad-por-secretaria.json", "w")
f.write(json.dumps(fjson4, indent=4, sort_keys=True))
f.close()

