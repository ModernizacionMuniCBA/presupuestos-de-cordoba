# -*- coding: utf-8 -*-
"""
Transformar los CSV en varios JSON compatibles con el _Zoomable Treemap_ para diferentes gráficos.
"""

p17recursos = "recursos-2017.csv"

import csv
import json

fjson1 = []  # json final para grafico de recursos de rentas del presupuesto 2017
fjson2 = []  # json final para grafico de recursos de afectaciones del presupuesto 2017
fjson3 = []  # json final para grafico de recursos totales presupuesto 2017

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
        nivel_princ = int(partes_nivel[0])

        nombre = row["Concepto"].strip()
        detalle[nivel] = nombre

        # el ingreso (nivel_princ) "1" tiene 4 niveles, el "2" tienen 3 y el "3" tiene 1
        if nivel_princ == 3:
            nivel = 4
            detalle[2] = detalle[1]
            detalle[3] = detalle[1]
            detalle[4] = detalle[1]
        elif nivel_princ == 2 and nivel == 3:
            nivel = 4
            detalle[4] = detalle[3]

        if nivel == 4:
            rentas = int(row["RENTAS GENERALES"])
            afectacion = int(row["AFECTACION ESPECIFICA"])

            linea = {"key": detalle[4],
                        "rec1": detalle[1],
                        "rec2": detalle[2],
                        "rec3": detalle[3],
                        "valor": rentas}

            fjson1.append(linea)

            linea = {"key": detalle[4],
                        "rec1": detalle[1],
                        "rec2": detalle[2],
                        "rec3": detalle[3],
                        "valor": afectacion}
            fjson2.append(linea)

            if rentas > 0:
                linea = {"key": detalle[4],
                        "rec0": "Rentas Generales",
                        "rec1": detalle[1],
                        "rec2": detalle[2],
                        "rec3": detalle[3],
                        "valor": rentas}
                fjson3.append(linea)

            if afectacion > 0:
                linea = {"key": detalle[4],
                        "rec0": "Afectación Específica",
                        "rec1": detalle[1],
                        "rec2": detalle[2],
                        "rec3": detalle[3],
                        "valor": afectacion}
                fjson3.append(linea)


f = open("recursos-rentas-presupuesto-2017.json", "w")
f.write(json.dumps(fjson1, indent=4, sort_keys=True))
f.close()

f = open("recursos-afectacion-presupuesto-2017.json", "w")
f.write(json.dumps(fjson2, indent=4, sort_keys=True))
f.close()

f = open("recursos-totales-presupuesto-2017.json", "w")
f.write(json.dumps(fjson3, indent=4, sort_keys=True))
f.close()
