#!/bin/bash

# PlayGPT Setup Script
# Este script automatiza el setup inicial del proyecto

set -e

echo "🚀 PlayGPT Setup Script"
echo "======================="
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Verificar Node.js
print_info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 18.17 o superior."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
print_success "Node.js $NODE_VERSION detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado."
    exit 1
fi

# Instalar dependencias
print_info "Instalando dependencias..."
npm install
print_success "Dependencias instaladas"

# Crear archivo .env.local si no existe
if [ ! -f .env.local ]; then
    print_info "Creando archivo .env.local..."
    cp .env.example .env.local
    print_success "Archivo .env.local creado"
    print_warning "IMPORTANTE: Edita .env.local y agrega tu BOTPRESS_CLIENT_ID"

    # Preguntar si quiere agregar el Client ID ahora
    echo ""
    read -p "¿Tienes tu Botpress Client ID a mano? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Ingresa tu Botpress Client ID: " CLIENT_ID
        if [ ! -z "$CLIENT_ID" ]; then
            sed -i.bak "s/NEXT_PUBLIC_BOTPRESS_CLIENT_ID=.*/NEXT_PUBLIC_BOTPRESS_CLIENT_ID=$CLIENT_ID/" .env.local
            rm .env.local.bak 2>/dev/null || true
            print_success "Client ID configurado"
        fi
    fi
else
    print_info "Archivo .env.local ya existe, omitiendo..."
fi

echo ""
print_success "Setup completado!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Próximos pasos:"
echo ""
echo "1. Si no lo hiciste, configura tu Botpress Client ID en .env.local:"
echo "   ${BLUE}nano .env.local${NC}"
echo ""
echo "2. Inicia el servidor de desarrollo:"
echo "   ${BLUE}npm run dev${NC}"
echo ""
echo "3. Abre tu navegador en:"
echo "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "Para más información, lee README.md o QUICK_START.md"
echo ""
