#!/bin/bash

echo "🧪 Pruebas de la API de Habitaciones"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"

echo -e "${YELLOW}1️⃣  Obtener habitaciones populares (GET /api/habitaciones?limit=8)${NC}"
echo ""
curl -s "${BASE_URL}/habitaciones?limit=8" | python -m json.tool 2>/dev/null || curl -s "${BASE_URL}/habitaciones?limit=8"
echo ""
echo ""

echo -e "${YELLOW}2️⃣  Obtener tipos de habitación (GET /api/habitaciones/tipos/lista)${NC}"
echo ""
curl -s "${BASE_URL}/habitaciones/tipos/lista" | python -m json.tool 2>/dev/null || curl -s "${BASE_URL}/habitaciones/tipos/lista"
echo ""
echo ""

echo -e "${YELLOW}3️⃣  Obtener habitación 102 (GET /api/habitaciones/102)${NC}"
echo ""
curl -s "${BASE_URL}/habitaciones/102" | python -m json.tool 2>/dev/null || curl -s "${BASE_URL}/habitaciones/102"
echo ""
echo ""

echo -e "${GREEN}✅ Pruebas completadas${NC}"
