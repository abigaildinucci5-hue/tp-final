/**
 * Helper para convertir URLs de imágenes a usar el proxy del backend
 * Esto evita problemas de CORB con Unsplash y otros servicios
 */

import { API_BASE_URL } from '../constantes/config';

/**
 * Convierte una URL de imagen para usar el proxy del backend
 * @param {string} imageUrl - URL original de la imagen
 * @returns {string} URL del proxy o original si no es válida
 */
export const getProxyImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return 'https://via.placeholder.com/300';
  }

  // Si es una URL externa de imágenes, pasar por el proxy
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      const encodedUrl = encodeURIComponent(imageUrl);
      return `${API_BASE_URL}/api/proxy/image?url=${encodedUrl}`;
    } catch (error) {
      console.warn('Error encoding image URL:', error);
      return imageUrl;
    }
  }

  // Si es una URL relativa o local, retornar tal cual
  return imageUrl;
};

/**
 * Convierte un array de URLs de imágenes para usar el proxy
 * @param {string[]} urls - Array de URLs
 * @returns {string[]} Array de URLs proxificadas
 */
export const getProxyImageUrls = (urls) => {
  if (!Array.isArray(urls)) {
    return [];
  }

  return urls.map(url => getProxyImageUrl(url));
};

export default {
  getProxyImageUrl,
  getProxyImageUrls,
};
