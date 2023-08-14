from flask import Flask, request, jsonify

app = Flask(__name__)

prestamos = []
id_counter = 1

class Prestamo:
    def __init__(self, estudiante, auxiliar, elemento):
        global id_counter
        self.id = id_counter
        id_counter += 1
        self.estudiante = estudiante
        self.auxiliar = auxiliar
        self.elemento = elemento
        self.estado = "pendiente"

@app.route('/prestamos', methods=['POST'])
def crear_prestamo():
    data = request.get_json()
    estudiante = data['estudiante']
    auxiliar = data['auxiliar']
    elemento = data['elemento']
    
    nuevo_prestamo = Prestamo(estudiante, auxiliar, elemento)
    prestamos.append(nuevo_prestamo)
    
    return jsonify({'message': 'Préstamo creado exitosamente'})

@app.route('/prestamos', methods=['GET'])
def obtener_prestamos():
    prestamos_data = []
    for prestamo in prestamos:
        prestamos_data.append({
            'id': prestamo.id,
            'estudiante': prestamo.estudiante,
            'auxiliar': prestamo.auxiliar,
            'elemento': prestamo.elemento,
            'estado': prestamo.estado
        })
    return jsonify(prestamos_data)

@app.route('/prestamos/<int:prestamo_id>', methods=['GET'])
def obtener_prestamo(prestamo_id):
    for prestamo in prestamos:
        if prestamo.id == prestamo_id:
            return jsonify({
                'id': prestamo.id,
                'estudiante': prestamo.estudiante,
                'auxiliar': prestamo.auxiliar,
                'elemento': prestamo.elemento,
                'estado': prestamo.estado
            })
    return jsonify({'message': 'Préstamo no encontrado'}), 404

@app.route('/prestamos/estudiante/<string:estudiante>', methods=['GET'])
def obtener_prestamos_estudiante(estudiante):
    prestamos_estudiante = []
    for prestamo in prestamos:
        if prestamo.estudiante == estudiante:
            prestamos_estudiante.append({
                'id': prestamo.id,
                'estudiante': prestamo.estudiante,
                'auxiliar': prestamo.auxiliar,
                'elemento': prestamo.elemento,
                'estado': prestamo.estado
            })
    return jsonify(prestamos_estudiante)

@app.route('/prestamos/devolver/<int:prestamo_id>', methods=['PUT'])
def devolver_prestamo(prestamo_id):
    for prestamo in prestamos:
        if prestamo.id == prestamo_id:
            prestamo.estado = 'devuelto'
            return jsonify({'message': 'Préstamo marcado como devuelto'})
    return jsonify({'message': 'Préstamo no encontrado'}), 404

# Función opcional 1: Calcular la cantidad de préstamos entregados en un día específico
@app.route('/prestamos/cantidad_por_dia/<string:fecha>', methods=['GET'])
def cantidad_prestamos_por_dia(fecha):
    cantidad = 0
    for prestamo in prestamos:
        if prestamo.fecha == fecha:
            cantidad += 1
    return jsonify({'cantidad': cantidad})

# Función opcional 2: Actualizar los campos de un préstamo específico por id
@app.route('/prestamos/actualizar/<int:prestamo_id>', methods=['PUT'])
def actualizar_prestamo(prestamo_id):
    data = request.get_json()
    for prestamo in prestamos:
        if prestamo.id == prestamo_id:
            prestamo.estudiante = data['estudiante']
            prestamo.auxiliar = data['auxiliar']
            prestamo.elemento = data['elemento']
            return jsonify({'message': 'Préstamo actualizado'})
    return jsonify({'message': 'Préstamo no encontrado'}), 404

# Función opcional 3: Mostrar todos los préstamos pendientes
@app.route('/prestamos/pendientes', methods=['GET'])
def obtener_prestamos_pendientes():
    prestamos_pendientes = []
    for prestamo in prestamos:
        if prestamo.estado == 'pendiente':
            prestamos_pendientes.append({
                'id': prestamo.id,
                'estudiante': prestamo.estudiante,
                'auxiliar': prestamo.auxiliar,
                'elemento': prestamo.elemento,
                'estado': prestamo.estado
            })
    return jsonify(prestamos_pendientes)

# Función opcional 4: Calcular la cantidad de préstamos hechos por un auxiliar específico
@app.route('/prestamos/cantidad_por_auxiliar/<string:auxiliar>', methods=['GET'])
def cantidad_prestamos_por_auxiliar(auxiliar):
    cantidad = 0
    for prestamo in prestamos:
        if prestamo.auxiliar == auxiliar:
            cantidad += 1
    return jsonify({'cantidad': cantidad})

if __name__ == '__main__':
    app.run(debug=True)