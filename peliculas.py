import json

# Cargar el archivo JSON en memoria
def cargar_archivo(nombre_archivo):
    with open(nombre_archivo, 'r') as archivo:
        data = json.load(archivo)
    return data

# Filtrar películas por género
def filtrar_por_genero(peliculas, genero_busqueda):
    peliculas_filtradas = []
    
    genero_busqueda = genero_busqueda.lower()
    
    for pelicula in peliculas:
        generos_pelicula = [genero.lower() for genero in pelicula['genre']]
        
        if any(genero_busqueda in genero for genero in generos_pelicula):
            peliculas_filtradas.append(pelicula)
    
    return peliculas_filtradas

# Función para mostrar el menú y procesar la elección del usuario
def mostrar_menu():
    print("1. Filtrar películas por género")
    print("2. Salir")
    opcion = input("Ingrese el número de la opción deseada: ")
    return opcion

# Cargar el archivo JSON en memoria
nombre_archivo = "C:/Users/Wilmar osorio/Desktop/prueba_tecnica/movies.json"
peliculas = cargar_archivo(nombre_archivo)

# Ciclo principal del programa
while True:
    opcion_elegida = mostrar_menu()

    if opcion_elegida == "1":
        genero_busqueda = input("Ingrese el género a buscar: ")
        peliculas_filtradas = filtrar_por_genero(peliculas, genero_busqueda)
        
        if peliculas_filtradas:
            print("Películas encontradas:")
            for pelicula in peliculas_filtradas:
                print("- Título:", pelicula['title'])
                print("  Géneros:", ', '.join(pelicula['genre']))
                print("  Año:", pelicula['year'])
                print("  Director:", pelicula['director'])
                print("  Duración:", pelicula['duration'], "minutos")
                print("  Poster:", pelicula['poster'])
                print("  Rate:", pelicula['rate'])
                print()
        else:
            print("No se encontraron películas para el género ingresado.")
    
    elif opcion_elegida == "2":
        print("¡Hasta luego!")
        break
    
    else:
        print("Opción inválida. Por favor, elija una opción válida.")