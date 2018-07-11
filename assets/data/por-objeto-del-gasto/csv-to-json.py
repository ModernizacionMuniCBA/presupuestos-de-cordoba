"""
Transformar los CSV en varios JSON compatibles con el _Zoomable Treemap_ para diferentes gráficos.
"""

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
    max_nivel = 6  # nivel jerárquico máximo hasta el cual se graficará

    detalle = {}  # detalle de la linea actual dentro de la estructura
    nivel_anterior = -1  # Cuando el nivel pase a uno mayor todavía no recojo el dato. Cuando sea igual o menor quiere decir que llegue al máximo y ya puedo recoger el dato
    for row in reader:

        nivel = None if row['Nivel'] == "" else int(row['Nivel'])

        if nivel is not None:
            nombre = row["Nombre"].strip()
            if nombre.split()[0].isnumeric():
                nombre = " ".join(nombre.split()[1:])
            detalle[nivel] = nombre
            value = 0 if row["Total"] == "" else int(row["Total"])
            print("LINEA {} {}: {} : ${}".format(nivel, nivel_anterior, nombre, value))

            # Genero las lineas del JSON y solo las agrego al archivo si corresponde (si es el último nivel de desagregacion buscado)

            # el nivel mínimo que tiene de desagregacion es 3. Como la estructura de esto debe ser fija, requiero siempre el máximo para todos los casos
            # completqr desde aqui, hasta el final
            linea = {"key": detalle[nivel], "value": value}
            for n in range(nivel + 1, max_nivel):
                detalle[n] = detalle[n-1]

            for n in range(1, max_nivel):
                linea["rec{}".format(n)] = detalle[n]

            # ver si grabamos esta linea
            graba = False
            if nivel == max_nivel:
                graba = True
            elif nivel <= max_nivel:
                if nivel_anterior < max_nivel and (nivel < nivel_anterior or nivel == nivel_anterior):
                    # debo grabar el anterior que ya no tiene hijos
                    print("GRABA ANT")
                    fjson1.append(linea_anterior)

            if graba:
                print("GRABA")
                fjson1.append(linea)

            linea_anterior = linea
            nivel_anterior = nivel

    print("GRABA ULT ANT")  # la ultima linea se la morfaba!
    fjson1.append(linea_anterior)


f = open("presupuesto-por-objeto-del-gasto.json", "w")
f.write(json.dumps(fjson1, indent=4, sort_keys=True))
f.close()
