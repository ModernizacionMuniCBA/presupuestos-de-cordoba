# -*- coding: utf-8 -*-
"""
Transformar los CSV en varios JSON compatibles con el _Zoomable Treemap_ para diferentes gráficos.
"""

p17recursos = "recursos-2017.csv"

import csv
import json

fjson1 = []  # json final para grafico de recursos de totales del presupuesto 2017 para Tabla

with open(p17recursos) as csvfile:
    """
    Este archivo describe los ingresos previstos en el presupuesto 2017
    _Nivel_ que define la estructura jerárquica de los datos
    """
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')


    detalle = {}  # detalle de la linea actual dentro de la estructura
    for row in reader:

        partes_nivel = row["Nivel"].split(".")
        nivel = len(partes_nivel)
        nombre = row["Concepto"].strip()
        if nivel == 1:
            if row["Nivel"] != "0":
                linea = {"key": row["Nivel"],
                        "key_0":partes_nivel[0],
                        "concepto": nombre,
                        "nivel": nivel,
                        "subnivel": "",
                        "valor": int(row["TOTAL "])}
                fjson1.append(linea)
        if nivel >1 and nivel <= 3:
            if row["Nivel"] != "0":
                linea = {"key": row["Nivel"],
                        "key_0":partes_nivel[0],
                        "concepto": nombre,
                        "nivel": nivel,
                        "subnivel": partes_nivel[1],
                        "valor": int(row["TOTAL "])}

                fjson1.append(linea)
print fjson1
f = open("recursos-totales-presupuesto-2017-tabla.json", "w")
f.write(json.dumps(fjson1, indent=4, sort_keys=True))
f.close()
