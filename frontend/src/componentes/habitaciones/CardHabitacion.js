import React from 'react';
import './CardHabitacion.styles';

/**
 * Componente CardHabitacion
 * Muestra la información de una habitación en formato de tarjeta
 * 
 * @param {Object} props
 * @param {Object} props.habitacion - Datos de la habitación
 * @param {Function} props.onSelect - Callback al seleccionar la habitación
 * @param {Function} props.onEdit - Callback al editar (opcional)
 * @param {Function} props.onDelete - Callback al eliminar (opcional)
 * @param {boolean} props.showActions - Mostrar botones de acción
 * @param {boolean} props.isSelected - Si la habitación está seleccionada
 */
const CardHabitacion = ({ 
  habitacion, 
  onSelect, 
  onEdit, 
  onDelete,
  showActions = false,
  isSelected = false 
}) => {
  
  const {
    numero,
    tipo,
    precio,
    capacidad,
    descripcion,
    estado,
    imagen,
    amenidades = []
  } = habitacion;

  // Obtener clase de estado
  const getEstadoClass = () => {
    switch(estado?.toLowerCase()) {
      case 'disponible':
        return 'estado-disponible';
      case 'ocupada':
        return 'estado-ocupada';
      case 'mantenimiento':
        return 'estado-mantenimiento';
      case 'reservada':
        return 'estado-reservada';
      default:
        return 'estado-default';
    }
  };

  // Obtener texto del estado
  const getEstadoTexto = () => {
    return estado || 'No disponible';
  };

  // Manejar click en la tarjeta
  const handleClick = () => {
    if (onSelect) {
      onSelect(habitacion);
    }
  };

  // Manejar edición
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(habitacion);
    }
  };

  // Manejar eliminación
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(habitacion);
    }
  };

  return (
    <div 
      className={`card-habitacion ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {/* Imagen de la habitación */}
      <div className="card-habitacion__imagen">
        {imagen ? (
          <img src={imagen} alt={`Habitación ${numero}`} />
        ) : (
          <div className="card-habitacion__imagen-placeholder">
            <span>🏨</span>
          </div>
        )}
        
        {/* Badge de estado */}
        <div className={`card-habitacion__estado ${getEstadoClass()}`}>
          {getEstadoTexto()}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="card-habitacion__contenido">
        {/* Cabecera */}
        <div className="card-habitacion__header">
          <h3 className="card-habitacion__numero">Habitación {numero}</h3>
          <span className="card-habitacion__tipo">{tipo}</span>
        </div>

        {/* Descripción */}
        {descripcion && (
          <p className="card-habitacion__descripcion">
            {descripcion}
          </p>
        )}

        {/* Información */}
        <div className="card-habitacion__info">
          <div className="card-habitacion__info-item">
            <span className="icon">👥</span>
            <span>{capacidad} {capacidad === 1 ? 'persona' : 'personas'}</span>
          </div>
          
          {amenidades.length > 0 && (
            <div className="card-habitacion__amenidades">
              {amenidades.slice(0, 3).map((amenidad, index) => (
                <span key={index} className="amenidad-tag">
                  {amenidad}
                </span>
              ))}
              {amenidades.length > 3 && (
                <span className="amenidad-tag">+{amenidades.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Precio y acciones */}
        <div className="card-habitacion__footer">
          <div className="card-habitacion__precio">
            <span className="precio-valor">${precio}</span>
            <span className="precio-periodo">/noche</span>
          </div>

          {showActions && (
            <div className="card-habitacion__acciones">
              {onEdit && (
                <button 
                  className="btn-accion btn-editar"
                  onClick={handleEdit}
                  title="Editar"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button 
                  className="btn-accion btn-eliminar"
                  onClick={handleDelete}
                  title="Eliminar"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardHabitacion;