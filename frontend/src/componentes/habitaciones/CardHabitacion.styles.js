import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "column",
    height: "100%",
    elevation: 4, // sombra Android
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  imagenContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#667eea",
    position: "relative",
    overflow: "hidden",
  },

  imagen: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imagenPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 40,
  },

  estado: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },

  estadoDisponible: {
    backgroundColor: "rgba(40,167,69,0.9)",
  },
  estadoOcupada: {
    backgroundColor: "rgba(220,53,69,0.9)",
  },
  estadoMantenimiento: {
    backgroundColor: "rgba(255,193,7,0.9)",
  },
  estadoReservada: {
    backgroundColor: "rgba(0,123,255,0.9)",
  },
  estadoDefault: {
    backgroundColor: "rgba(108,117,125,0.9)",
  },

  contenido: {
    padding: 20,
    flexDirection: "column",
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  numero: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
  },

  tipo: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#f0f2f5",
    borderRadius: 6,
    fontSize: 14,
    color: "#495057",
    fontWeight: "500",
  },

  descripcion: {
    color: "#6c757d",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 16,
  },

  info: {
    marginBottom: 16,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  infoIcon: {
    fontSize: 18,
  },

  amenidades: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },

  amenidadTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#e7f3ff",
    color: "#007bff",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "500",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },

  precio: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },

  precioValor: {
    fontSize: 28,
    fontWeight: "700",
    color: "#28a745",
  },

  precioPeriodo: {
    fontSize: 14,
    color: "#6c757d",
  },

  acciones: {
    flexDirection: "row",
    gap: 8,
  },

  btnAccion: {
    padding: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  btnEditar: {
    backgroundColor: "#e7f3ff",
  },

  btnEliminar: {
    backgroundColor: "#ffe5e5",
  },
});
