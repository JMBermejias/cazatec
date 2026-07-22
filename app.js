// ============================================
// Cazatec - App Principal
// ============================================

let currentPage = 'page-dashboard';
let currentDocType = 'cazador';
let currentDocCategory = 'licencias';
let currentSpeciesFilter = 'todos';
let editingArmaId = null;
let editingCotoId = null;
let editingZonaId = null;
let editingJornadaId = null;
let currentDocId = null;
let currentSpeciesId = null;
let photoData = null;

// Maps
let generalMap = null;
let cotoMap = null;
let zonaMap = null;
let cotoMarker = null;
let zonaMarkers = [];
let zonaPolygon = null;
let allMarkers = [];
let allPolygons = [];

// ============================================
// ESPANISH HUNTING SPECIES DATABASE
// ============================================
const ESPECIES_CINEGETICAS = [
    {
        id: 'ciervo',
        nombre: 'Ciervo',
        nombreCientifico: 'Cervus elaphus',
        tipo: 'mayor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cervus_elaphus_Luc_Viatour_6.jpg/400px-Cervus_elaphus_Luc_Viatour_6.jpg',
        grupo: '1',
        temporada: 'Octubre - Febrero',
        descripcion: 'El ciervo es el cérvido más grande de la península ibérica. Los machos desarrollan grandes astas que renuevan cada año.',
        regulateInfo: 'Pieza de caza mayor. Se regula por cupos y jornadas.'
    },
    {
        id: 'corzo',
        nombre: 'Corzo',
        nombreCientifico: 'Capreolus capreolus',
        tipo: 'mayor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Roe_deer_%28Capreolus_capreolus%29_young_male_Cumnor.jpg/400px-Roe_deer_%28Capreolus_capreolus%29_young_male_Cumnor.jpg',
        grupo: '2',
        temporada: 'Octubre - Febrero',
        descripcion: 'El corzo es el cérvido más pequeño de Europa. Muy escurridizo y hábil para ocultarse.',
        regulateInfo: 'Pieza de caza media. Regulada por cupos.'
    },
    {
        id: 'jabali',
        nombre: 'Jabalí',
        nombreCientifico: 'Sus scrofa',
        tipo: 'mayor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Wildschwein%2C_N%C3%A4he_Pulverstampftor_%28cropped%29.jpg/400px-Wildschwein%2C_N%C3%A4he_Pulverstampftor_%28cropped%29.jpg',
        grupo: '3',
        temporada: 'Octubre - Marzo',
        descripcion: 'El jabalí es una de las piezas de caza mayor más codiciadas. Animal gregario y nocturno.',
        regulateInfo: 'Caza mayor. Requiere autorización específica en muchas zonas.'
    },
    {
        id: 'gamuza',
        nombre: 'Gamuza',
        nombreCientifico: 'Rupicapra rupicapra',
        tipo: 'mayor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/064_Wild_Chamois_Parc_r%C3%A9gional_Chasseral_Photo_by_Giles_Laurent.jpg/400px-064_Wild_Chamois_Parc_r%C3%A9gional_Chasseral_Photo_by_Giles_Laurent.jpg',
        grupo: '1',
        temporada: 'Noviembre - Diciembre',
        descripcion: 'Cápido alpino que habita en zonas montañosas. Pieza muy reputada por la dificultad de su caza.',
        regulateInfo: 'Caza mayor en montaña. Cupos muy restrictivos.'
    },
    {
        id: 'mouflon',
        nombre: 'Muflón',
        nombreCientifico: 'Ovis aries musimon',
        tipo: 'mayor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Ovis_orientalis_LC0267.jpg/400px-Ovis_orientalis_LC0267.jpg',
        grupo: '1',
        temporada: 'Octubre - Diciembre',
        descripcion: 'El muflón es un cérvido introducido en Baleares y otras zonas de montaña.',
        regulateInfo: 'Caza mayor. Regulada por cupos en zonas de montaña.'
    },
    {
        id: 'conejo',
        nombre: 'Conejo',
        nombreCientifico: 'Oryctolagus cuniculus',
        tipo: 'menor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Oryctolagus_cuniculus_-_euqirneto_-_419737670_%28cropped%29.jpeg/400px-Oryctolagus_cuniculus_-_euqirneto_-_419737670_%28cropped%29.jpeg',
        grupo: '2',
        temporada: 'Septiembre - Febrero',
        descripcion: 'El conejo europeo es la pieza de caza menor más común en España.',
        regulateInfo: 'Caza menor. Período general de caza.'
    },
    {
        id: 'perdiz',
        nombre: 'Perdiz Roja',
        nombreCientifico: 'Alectoris rufa',
        tipo: 'menor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Perdrix_rouge.jpg/400px-Perdrix_rouge.jpg',
        grupo: '2',
        temporada: 'Septiembre - Febrero',
        descripcion: 'La perdiz roja es la reina de la caza menor española. Muy apreciada por su volatería.',
        regulateInfo: 'Caza menor. Sujeta a regulación de cupos en algunas zonas.'
    },
    {
        id: 'paloma-torcaz',
        nombre: 'Paloma Torcaz',
        nombreCientifico: 'Columba palumbus',
        tipo: 'menor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Columba_palumbus_EM1B1397_%2827445478998%29.jpg/400px-Columba_palumbus_EM1B1397_%2827445478998%29.jpg',
        grupo: '2',
        temporada: 'Septiembre - Marzo',
        descripcion: 'La paloma torcaz es la más grande de las palomas silvestres ibéricas.',
        regulateInfo: 'Caza menor. Período de veda estricto.'
    },
    {
        id: 'tordla',
        nombre: 'Tórdola Real',
        nombreCientifico: 'Turdus merula',
        tipo: 'menor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Common_Blackbird.jpg/400px-Common_Blackbird.jpg',
        grupo: '2',
        temporada: 'Septiembre - Marzo',
        descripcion: 'Ave paseriforme de tamaño medio, muy popular entre los cazadores a beata.',
        regulateInfo: 'Caza menor. Se puede cazar a batida o a beata.'
    },
    {
        id: 'liebre',
        nombre: 'Liebre Europea',
        nombreCientifico: 'Lepus europaeus',
        tipo: 'menor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/European_hare_%28Lepus_europaeus%29_Marken_2.jpg/400px-European_hare_%28Lepus_europaeus%29_Marken_2.jpg',
        grupo: '2',
        temporada: 'Septiembre - Febrero',
        descripcion: 'La liebre europea es una de las piezas de caza menor más extendidas.',
        regulateInfo: 'Caza menor. Período general de caza.'
    },
    {
        id: 'zorro',
        nombre: 'Zorro',
        nombreCientifico: 'Vulpes vulpes',
        tipo: 'mayor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog_%28cropped%29.jpg/400px-Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog_%28cropped%29.jpg',
        grupo: '3',
        temporada: 'Permanente',
        descripcion: 'El zorro es un depredador oportunista. Se puede cazar todo el año en la mayoría de comunidades.',
        regulateInfo: 'Caza mayor. Período de caza muy amplio.'
    },
    {
        id: 'gato-silvestre',
        nombre: 'Gato Montés',
        nombreCientifico: 'Felis silvestris',
        tipo: 'mayor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Felis_silvestris_silvestris_Luc_Viatour.jpg/400px-Felis_silvestris_silvestris_Luc_Viatour.jpg',
        grupo: '1',
        temporada: 'PROHIBIDO',
        descripcion: 'El gato montés es una especie protegida. Su caza está prohibida.',
        regulateInfo: 'PROTEGIDO. Caza absolutamente prohibida.'
    },
    {
        id: 'lynx',
        nombre: 'Lince Ibérico',
        nombreCientifico: 'Lynx pardinus',
        tipo: 'mayor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Lince_ib%C3%A9rico_%28Lynx_pardinus%29%2C_Almuradiel%2C_Ciudad_Real%2C_Espa%C3%B1a%2C_2021-12-19%2C_DD_06.jpg/400px-Lince_ib%C3%A9rico_%28Lynx_pardinus%29%2C_Almuradiel%2C_Ciudad_Real%2C_Espa%C3%B1a%2C_2021-12-19%2C_DD_06.jpg',
        grupo: '1',
        temporada: 'PROHIBIDO',
        descripcion: 'El lince ibérico es el felino más amenazado del mundo. PROHIBIDA su caza.',
        regulateInfo: 'PROTEGIDO. En peligro de extinción.'
    },
    {
        id: 'buitre',
        nombre: 'Buitre Leonado',
        nombreCientifico: 'Gyps fulvus',
        tipo: 'mayor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Gyps_fulvus_in_flight_-_Spain.jpg/400px-Gyps_fulvus_in_flight_-_Spain.jpg',
        grupo: '1',
        temporada: 'PROHIBIDO',
        descripcion: 'El buitre leonado es un ave carroñera protegida. Su caza está prohibida.',
        regulateInfo: 'PROTEGIDO. Prohibida su caza y captura.'
    },
    {
        id: 'aguila-real',
        nombre: 'Águila Real',
        nombreCientifico: 'Aquila chrysaetos',
        tipo: 'mayor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Maakotka_%28Aquila_chrysaetos%29_by_Jarkko_J%C3%A4rvinen.jpg/400px-Maakotka_%28Aquila_chrysaetos%29_by_Jarkko_J%C3%A4rvinen.jpg',
        grupo: '1',
        temporada: 'PROHIBIDO',
        descripcion: 'El águila real es una de las aves rapaces más majestuosas. Protegida.',
        regulateInfo: 'PROTEGIDO. Prohibida su caza.'
    },
    {
        id: 'garcilla',
        nombre: 'Garcilla Bueyera',
        nombreCientifico: 'Bubulcus ibis',
        tipo: 'menor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Cattle_Egret_%28Bubulcus_ibis%29_Crop.jpg/400px-Cattle_Egret_%28Bubulcus_ibis%29_Crop.jpg',
        grupo: '2',
        temporada: 'Septiembre - Febrero',
        descripcion: 'Ave zancuda que habita en zonas húmedas y praderas.',
        regulateInfo: 'Caza menor. Sujeta a regulación.'
    },
    {
        id: 'ardilla',
        nombre: 'Ardilla Común',
        nombreCientifico: 'Sciurus vulgaris',
        tipo: 'menor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Eichh%C3%B6rnchen_D%C3%BCsseldorf_Hofgarten_edit.jpg/400px-Eichh%C3%B6rnchen_D%C3%BCsseldorf_Hofgarten_edit.jpg',
        grupo: '2',
        temporada: 'Septiembre - Febrero',
        descripcion: 'La ardilla común habita en bosques de pinos y hayedos.',
        regulateInfo: 'Caza menor. Sujeta a regulación.'
    },
    {
        id: 'chova',
        nombre: 'Chova Piquigualda',
        nombreCientifico: 'Pyrrhocorax pyrrhocorax',
        tipo: 'menor',
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Alpine_Chough_by_Jim_Higham.jpg/400px-Alpine_Chough_by_Jim_Higham.jpg',
        grupo: '2',
        temporada: 'Septiembre - Febrero',
        descripcion: 'Ave de plumaje negro con pico rojo. Habita en zonas montañosas.',
        regulateInfo: 'Caza menor. Regulada en algunas comunidades.'
    }
];

// ============================================
// NAVIGATION
// ============================================
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(pageId).classList.add('active');
    const navBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (navBtn) navBtn.classList.add('active');

    currentPage = pageId;
    window.scrollTo(0, 0);

    // Initialize maps when needed
    if (pageId === 'page-mapa') {
        setTimeout(() => initGeneralMap(), 100);
    }

    // Load data for specific pages
    if (pageId === 'page-documentos') {
        loadDocumentsList();
    }
    if (pageId === 'page-jornadas') {
        loadJornadasList();
        populateJornadaSelects();
    }
    if (pageId === 'page-cazador') {
        loadCazador();
        loadCazadorDocs();
        loadDogsList();
    }
    if (pageId === 'page-especies') {
        renderSpecies(currentSpeciesFilter);
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };

    toast.innerHTML = `<i class="${icons[type]}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

// ============================================
// CAZADOR / PERFIL
// ============================================
async function guardarCazador() {
    const cazador = {
        nombre: document.getElementById('cazador-nombre').value,
        dni: document.getElementById('cazador-dni').value,
        nacimiento: document.getElementById('cazador-nacimiento').value,
        telefono: document.getElementById('cazador-telefono').value,
        email: document.getElementById('cazador-email').value,
        direccion: document.getElementById('cazador-direccion').value,
        licencia: document.getElementById('cazador-licencia').value,
        fechaLicencia: document.getElementById('cazador-fecha-licencia').value,
        caducidadLicencia: document.getElementById('cazador-caducidad-licencia').value,
        grupo: document.getElementById('cazador-grupo').value,
        updatedAt: new Date().toISOString()
    };

    await DataService.save('cazador', 'perfil', cazador);
    showToast('Perfil guardado correctamente');
    updateDashboardStats();
}

async function loadCazador() {
    const cazador = await DataService.get('cazador', 'perfil');
    if (cazador) {
        document.getElementById('cazador-nombre').value = cazador.nombre || '';
        document.getElementById('cazador-dni').value = cazador.dni || '';
        document.getElementById('cazador-nacimiento').value = cazador.nacimiento || '';
        document.getElementById('cazador-telefono').value = cazador.telefono || '';
        document.getElementById('cazador-email').value = cazador.email || '';
        document.getElementById('cazador-direccion').value = cazador.direccion || '';
        document.getElementById('cazador-licencia').value = cazador.licencia || '';
        document.getElementById('cazador-fecha-licencia').value = cazador.fechaLicencia || '';
        document.getElementById('cazador-caducidad-licencia').value = cazador.caducidadLicencia || '';
        document.getElementById('cazador-grupo').value = cazador.grupo || '';

        if (cazador.foto) {
            document.getElementById('cazador-foto').innerHTML = `<img src="${cazador.foto}" alt="Foto">`;
        }
    }
}

// ============================================
// ARMAS
// ============================================
function showArmaForm(arma = null) {
    const container = document.getElementById('arma-form-container');
    container.style.display = 'block';

    if (arma) {
        editingArmaId = arma.id;
        document.getElementById('arma-form-title').innerHTML = '<i class="fas fa-edit"></i> Editar Arma';
        document.getElementById('arma-marca').value = arma.marca || '';
        document.getElementById('arma-modelo').value = arma.modelo || '';
        document.getElementById('arma-tipo').value = arma.tipo || '';
        document.getElementById('arma-calibre').value = arma.calibre || '';
        document.getElementById('arma-serie').value = arma.serie || '';
        document.getElementById('arma-registro').value = arma.registro || '';
        document.getElementById('arma-fecha-compra').value = arma.fechaCompra || '';
        document.getElementById('arma-notas').value = arma.notas || '';
    } else {
        editingArmaId = null;
        document.getElementById('arma-form-title').innerHTML = '<i class="fas fa-plus"></i> Nueva Arma';
        document.getElementById('form-arma').reset();
    }

    container.scrollIntoView({ behavior: 'smooth' });
}

function hideArmaForm() {
    document.getElementById('arma-form-container').style.display = 'none';
    editingArmaId = null;
    document.getElementById('form-arma').reset();
}

async function guardarArma() {
    const id = editingArmaId || 'arma_' + Date.now();
    const arma = {
        marca: document.getElementById('arma-marca').value,
        modelo: document.getElementById('arma-modelo').value,
        tipo: document.getElementById('arma-tipo').value,
        calibre: document.getElementById('arma-calibre').value,
        serie: document.getElementById('arma-serie').value,
        registro: document.getElementById('arma-registro').value,
        fechaCompra: document.getElementById('arma-fecha-compra').value,
        notas: document.getElementById('arma-notas').value,
        updatedAt: new Date().toISOString()
    };

    await DataService.save('armas', id, arma);
    hideArmaForm();
    loadArmasList();
    showToast(editingArmaId ? 'Arma actualizada' : 'Arma registrada');
    updateDashboardStats();
}

async function loadArmasList() {
    const armas = await DataService.getAll('armas');
    const container = document.getElementById('armas-list');

    if (Object.keys(armas).length === 0) {
        container.innerHTML = '<p class="empty-state">No hay armas registradas</p>';
        return;
    }

    const iconMap = {
        'escopeta': 'fas fa-gun',
        'riflé': 'fas fa-crosshairs',
        'carabina': 'fas fa-bullseye',
        'pistola': 'fas fa-gun',
        'otro': 'fas fa-toolbox'
    };

    const colorMap = {
        'escopeta': 'green',
        'riflé': 'blue',
        'carabina': 'orange',
        'pistola': 'red',
        'otro': 'purple'
    };

    container.innerHTML = Object.entries(armas).map(([id, arma]) => `
        <div class="item-card">
            <div class="item-icon ${colorMap[arma.tipo] || 'green'}">
                <i class="${iconMap[arma.tipo] || 'fas fa-gun'}"></i>
            </div>
            <div class="item-info">
                <h4>${arma.marca} ${arma.modelo}</h4>
                <p>${arma.tipo || 'Sin tipo'} · ${arma.calibre || 'Sin calibre'} · S/N: ${arma.serie || '-'}</p>
            </div>
            <div class="item-actions">
                <button class="btn-icon" onclick="editArma('${id}')" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" onclick="deleteArma('${id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

async function editArma(id) {
    const arma = await DataService.get('armas', id);
    if (arma) {
        arma.id = id;
        showArmaForm(arma);
    }
}

async function deleteArma(id) {
    if (confirm('¿Eliminar esta arma?')) {
        await DataService.remove('armas', id);
        loadArmasList();
        showToast('Arma eliminada', 'info');
        updateDashboardStats();
    }
}

// ============================================
// COTOS
// ============================================
function showCotoForm(coto = null) {
    const container = document.getElementById('coto-form-container');
    container.style.display = 'block';

    if (coto) {
        editingCotoId = coto.id;
        document.getElementById('coto-form-title').innerHTML = '<i class="fas fa-edit"></i> Editar Coto';
        document.getElementById('coto-nombre').value = coto.nombre || '';
        document.getElementById('coto-ubicacion').value = coto.ubicacion || '';
        document.getElementById('coto-superficie').value = coto.superficie || '';
        document.getElementById('coto-tipo').value = coto.tipo || '';
        document.getElementById('coto-especies').value = coto.especies || '';
        document.getElementById('coto-contacto').value = coto.contacto || '';
        document.getElementById('coto-expediente').value = coto.expediente || '';
        document.getElementById('coto-temporada').value = coto.temporada || '';
        document.getElementById('coto-descripcion').value = coto.descripcion || '';
    } else {
        editingCotoId = null;
        document.getElementById('coto-form-title').innerHTML = '<i class="fas fa-plus"></i> Nuevo Coto';
        document.getElementById('form-coto').reset();
    }

    container.scrollIntoView({ behavior: 'smooth' });
}

function hideCotoForm() {
    document.getElementById('coto-form-container').style.display = 'none';
    document.getElementById('map-picker').style.display = 'none';
    editingCotoId = null;
    document.getElementById('form-coto').reset();
}

function showMapPicker() {
    const picker = document.getElementById('map-picker');
    picker.style.display = 'block';
    setTimeout(() => initCotoMap(), 100);
}

async function guardarCoto() {
    const id = editingCotoId || 'coto_' + Date.now();
    const coto = {
        nombre: document.getElementById('coto-nombre').value,
        ubicacion: document.getElementById('coto-ubicacion').value,
        superficie: document.getElementById('coto-superficie').value,
        tipo: document.getElementById('coto-tipo').value,
        especies: document.getElementById('coto-especies').value,
        contacto: document.getElementById('coto-contacto').value,
        expediente: document.getElementById('coto-expediente').value,
        temporada: document.getElementById('coto-temporada').value,
        descripcion: document.getElementById('coto-descripcion').value,
        lat: cotoMarker ? cotoMarker.getPosition().lat() : null,
        lng: cotoMarker ? cotoMarker.getPosition().lng() : null,
        updatedAt: new Date().toISOString()
    };

    await DataService.save('cotos', id, coto);
    hideCotoForm();
    loadCotosList();
    showToast(editingCotoId ? 'Coto actualizado' : 'Coto registrado');
    updateDashboardStats();
}

async function loadCotosList() {
    const cotos = await DataService.getAll('cotos');
    const container = document.getElementById('cotos-list');

    if (Object.keys(cotos).length === 0) {
        container.innerHTML = '<p class="empty-state">No hay cotos registrados</p>';
        return;
    }

    container.innerHTML = Object.entries(cotos).map(([id, coto]) => `
        <div class="item-card">
            <div class="item-icon green">
                <i class="fas fa-mountain"></i>
            </div>
            <div class="item-info">
                <h4>${coto.nombre}</h4>
                <p>${coto.ubicacion || ''} · ${coto.superficie ? coto.superficie + ' ha' : ''} · ${coto.tipo || ''}</p>
            </div>
            <div class="item-actions">
                <button class="btn-icon" onclick="editCoto('${id}')" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" onclick="deleteCoto('${id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

async function editCoto(id) {
    const coto = await DataService.get('cotos', id);
    if (coto) {
        coto.id = id;
        showCotoForm(coto);
    }
}

async function deleteCoto(id) {
    if (confirm('¿Eliminar este coto?')) {
        await DataService.remove('cotos', id);
        loadCotosList();
        showToast('Coto eliminado', 'info');
        updateDashboardStats();
    }
}

// ============================================
// ZONAS DE CAZA
// ============================================
function showZonaForm(zona = null) {
    const container = document.getElementById('zona-form-container');
    container.style.display = 'block';
    populateZonaSelects();

    if (zona) {
        editingZonaId = zona.id;
        document.getElementById('zona-nombre').value = zona.nombre || '';
        document.getElementById('zona-coto').value = zona.cotoId || '';
        document.getElementById('zona-especies').value = zona.especies || '';
        document.getElementById('zona-descripcion').value = zona.descripcion || '';
    } else {
        editingZonaId = null;
        document.getElementById('form-zona').reset();
    }

    container.scrollIntoView({ behavior: 'smooth' });
}

function hideZonaForm() {
    document.getElementById('zona-form-container').style.display = 'none';
    document.getElementById('zone-draw-map').style.display = 'none';
    editingZonaId = null;
    zonaMarkers = [];
    if (zonaPolygon) {
        zonaPolygon.setMap(null);
        zonaPolygon = null;
    }
}

async function populateZonaSelects() {
    const cotos = await DataService.getAll('cotos');
    const select = document.getElementById('zona-coto');
    select.innerHTML = '<option value="">Sin coto</option>' +
        Object.entries(cotos).map(([id, coto]) =>
            `<option value="${id}">${coto.nombre}</option>`
        ).join('');
}

function showZoneDrawMap() {
    document.getElementById('zone-draw-map').style.display = 'block';
    setTimeout(() => initZonaMap(), 100);
}

function clearZonePolygon() {
    zonaMarkers.forEach(m => m.setMap(null));
    zonaMarkers = [];
    if (zonaPolygon) {
        zonaPolygon.setMap(null);
        zonaPolygon = null;
    }
}

async function guardarZona() {
    const id = editingZonaId || 'zona_' + Date.now();
    const points = zonaMarkers.map(m => ({
        lat: m.getPosition().lat(),
        lng: m.getPosition().lng()
    }));

    const zona = {
        nombre: document.getElementById('zona-nombre').value,
        cotoId: document.getElementById('zona-coto').value,
        especies: document.getElementById('zona-especies').value,
        descripcion: document.getElementById('zona-descripcion').value,
        points: points,
        center: points.length > 0 ? {
            lat: points.reduce((s, p) => s + p.lat, 0) / points.length,
            lng: points.reduce((s, p) => s + p.lng, 0) / points.length
        } : null,
        updatedAt: new Date().toISOString()
    };

    await DataService.save('zonas', id, zona);
    hideZonaForm();
    loadZonasList();
    showToast(editingZonaId ? 'Zona actualizada' : 'Zona creada');
    updateDashboardStats();
}

async function loadZonasList() {
    const zonas = await DataService.getAll('zonas');
    const container = document.getElementById('zonas-list');

    if (Object.keys(zonas).length === 0) {
        container.innerHTML = '<p class="empty-state">No hay zonas definidas</p>';
        return;
    }

    const cotos = await DataService.getAll('cotos');

    container.innerHTML = Object.entries(zonas).map(([id, zona]) => `
        <div class="item-card">
            <div class="item-icon orange">
                <i class="fas fa-draw-polygon"></i>
            </div>
            <div class="item-info">
                <h4>${zona.nombre}</h4>
                <p>${cotos[zona.cotoId] ? cotos[zona.cotoId].nombre : 'Sin coto'} · ${zona.especies || ''} · ${zona.points ? zona.points.length + ' puntos' : ''}</p>
            </div>
            <div class="item-actions">
                <button class="btn-icon" onclick="editZona('${id}')" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" onclick="deleteZona('${id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

async function editZona(id) {
    const zona = await DataService.get('zonas', id);
    if (zona) {
        zona.id = id;
        showZonaForm(zona);
    }
}

async function deleteZona(id) {
    if (confirm('¿Eliminar esta zona?')) {
        await DataService.remove('zonas', id);
        loadZonasList();
        showToast('Zona eliminada', 'info');
        updateDashboardStats();
    }
}

// ============================================
// JORNADAS
// ============================================
function showJornadaForm(jornada = null) {
    const container = document.getElementById('jornada-form-container');
    container.style.display = 'block';
    populateJornadaSelects();

    if (jornada) {
        editingJornadaId = jornada.id;
        document.getElementById('jornada-fecha').value = jornada.fecha || '';
        document.getElementById('jornada-coto').value = jornada.cotoId || '';
        document.getElementById('jornada-tipo').value = jornada.tipo || 'monteria';
        document.getElementById('jornada-zona').value = jornada.zonaId || '';
        document.getElementById('jornada-observaciones').value = jornada.observaciones || '';
    } else {
        editingJornadaId = null;
        document.getElementById('form-jornada').reset();
        document.getElementById('jornada-fecha').value = new Date().toISOString().split('T')[0];
    }

    loadJornadaSpecies(jornada ? jornada.especiesCazadas || [] : []);
    container.scrollIntoView({ behavior: 'smooth' });
}

function hideJornadaForm() {
    document.getElementById('jornada-form-container').style.display = 'none';
    editingJornadaId = null;
}

async function populateJornadaSelects() {
    const cotos = await DataService.getAll('cotos');
    const cotoSelect = document.getElementById('jornada-coto');
    cotoSelect.innerHTML = '<option value="">Seleccionar coto...</option>' +
        Object.entries(cotos).map(([id, coto]) =>
            `<option value="${id}">${coto.nombre}</option>`
        ).join('');

    const zonas = await DataService.getAll('zonas');
    const zonaSelect = document.getElementById('jornada-zona');
    zonaSelect.innerHTML = '<option value="">Sin zona específica</option>' +
        Object.entries(zonas).map(([id, zona]) =>
            `<option value="${id}">${zona.nombre}</option>`
        ).join('');
}

function loadJornadaSpecies(selected = []) {
    const container = document.getElementById('jornada-species');
    const disponibles = ESPECIES_CINEGETICAS.filter(e => e.tipo === 'mayor' || e.tipo === 'menor');

    container.innerHTML = disponibles.map(sp => `
        <button type="button" class="species-toggle ${selected.includes(sp.id) ? 'selected' : ''}"
                onclick="this.classList.toggle('selected')" data-id="${sp.id}">
            <img src="${sp.imagen}" alt="${sp.nombre}" onerror="this.style.display='none'">
            ${sp.nombre}
        </button>
    `).join('');
}

async function guardarJornada() {
    const id = editingJornadaId || 'jornada_' + Date.now();
    const selectedSpecies = [];
    document.querySelectorAll('#jornada-species .species-toggle.selected').forEach(btn => {
        selectedSpecies.push(btn.dataset.id);
    });

    const jornada = {
        fecha: document.getElementById('jornada-fecha').value,
        cotoId: document.getElementById('jornada-coto').value,
        tipo: document.getElementById('jornada-tipo').value,
        zonaId: document.getElementById('jornada-zona').value,
        especiesCazadas: selectedSpecies,
        observaciones: document.getElementById('jornada-observaciones').value,
        createdAt: editingJornadaId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await DataService.save('jornadas', id, jornada);
    hideJornadaForm();
    loadJornadasList();
    showToast(editingJornadaId ? 'Jornada actualizada' : 'Jornada registrada');
    updateDashboardStats();
}

async function loadJornadasList() {
    const jornadas = await DataService.getAll('jornadas');
    const container = document.getElementById('jornadas-list');

    if (Object.keys(jornadas).length === 0) {
        container.innerHTML = '<p class="empty-state">No hay jornadas registradas</p>';
        return;
    }

    const cotos = await DataService.getAll('cotos');
    const sorted = Object.entries(jornadas).sort((a, b) => (b[1].fecha || '').localeCompare(a[1].fecha || ''));

    container.innerHTML = sorted.map(([id, j]) => {
        const coto = cotos[j.cotoId];
        const spCount = j.especiesCazadas ? j.especiesCazadas.length : 0;
        return `
            <div class="item-card">
                <div class="item-icon blue">
                    <i class="fas fa-book"></i>
                </div>
                <div class="item-info">
                    <h4>${j.fecha || 'Sin fecha'} - ${j.tipo || ''}</h4>
                    <p>${coto ? coto.nombre : 'Sin coto'} · ${spCount} especie(s) cazada(s)</p>
                </div>
                <div class="item-actions">
                    <button class="btn-icon" onclick="editJornada('${id}')" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon danger" onclick="deleteJornada('${id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

async function editJornada(id) {
    const jornada = await DataService.get('jornadas', id);
    if (jornada) {
        jornada.id = id;
        showJornadaForm(jornada);
    }
}

async function deleteJornada(id) {
    if (confirm('¿Eliminar esta jornada?')) {
        await DataService.remove('jornadas', id);
        loadJornadasList();
        showToast('Jornada eliminada', 'info');
        updateDashboardStats();
    }
}

// ============================================
// DOCUMENTOS
// ============================================
function addDocument(type) {
    currentDocType = type;
    photoData = null;
    document.getElementById('photo-preview-container').style.display = 'none';
    document.getElementById('photo-preview').src = '';
    document.getElementById('doc-name-input').value = '';
    document.getElementById('btn-save-doc').disabled = true;
    document.getElementById('photo-modal').style.display = 'flex';
}

function closePhotoModal() {
    document.getElementById('photo-modal').style.display = 'none';
    photoData = null;
}

function triggerCamera() {
    const input = document.getElementById('file-input');
    input.onchange = function() {
        handleFileSelect(this.files[0]);
    };
    input.click();
}

function triggerGallery() {
    const input = document.getElementById('file-input-gallery');
    input.onchange = function() {
        handleFileSelect(this.files[0]);
    };
    input.click();
}

function handleFileSelect(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        photoData = e.target.result;
        document.getElementById('photo-preview').src = photoData;
        document.getElementById('photo-preview-container').style.display = 'block';
        document.getElementById('btn-save-doc').disabled = false;
    };
    reader.readAsDataURL(file);
}

async function takePhoto(type) {
    currentDocType = type;
    addDocument(type);
}

async function saveDocument() {
    if (!photoData) return;

    const name = document.getElementById('doc-name-input').value || 'Documento';
    const category = document.getElementById('doc-category-select').value;

    const doc = {
        name: name,
        category: category,
        image: photoData,
        type: currentDocType,
        createdAt: new Date().toISOString()
    };

    const id = 'doc_' + Date.now();
    await DataService.save('documentos', id, doc);

    closePhotoModal();
    showToast('Documento guardado');

    if (currentPage === 'page-documentos') {
        loadDocumentsList();
    }
    loadCazadorDocs();
}

async function loadCazadorDocs() {
    const docs = await DataService.getAll('documentos');
    const container = document.getElementById('cazador-documentos');

    const cazadorDocs = Object.entries(docs).filter(([id, d]) => d.type === 'cazador');

    if (cazadorDocs.length === 0) {
        container.innerHTML = '<div class="doc-thumb"><div class="doc-thumb-empty"><i class="fas fa-file-image"></i><span>Sin docs</span></div></div>';
        return;
    }

    container.innerHTML = cazadorDocs.map(([id, doc]) => `
        <div class="doc-thumb" onclick="viewDoc('${id}')">
            <img src="${doc.image}" alt="${doc.name}">
            <div class="doc-thumb-label">${doc.name}</div>
        </div>
    `).join('');
}

async function loadDocumentsList() {
    const docs = await DataService.getAll('documentos');
    const container = document.getElementById('documents-list');

    const filtered = Object.entries(docs).filter(([id, d]) => d.category === currentDocCategory);

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay documentos en esta categoría</p>';
        return;
    }

    container.innerHTML = filtered.map(([id, doc]) => `
        <div class="doc-list-item" onclick="viewDoc('${id}')">
            <div class="doc-list-thumb">
                <img src="${doc.image}" alt="${doc.name}" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-file\\'></i>'">
            </div>
            <div class="doc-list-info">
                <h4>${doc.name}</h4>
                <p>${doc.category} · ${new Date(doc.createdAt).toLocaleDateString('es-ES')}</p>
            </div>
            <button class="btn-icon danger" onclick="event.stopPropagation();deleteDoc('${id}')" title="Eliminar">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function filterDocs(category) {
    currentDocCategory = category;
    document.querySelectorAll('.doc-cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === category);
    });
    loadDocumentsList();
}

async function viewDoc(id) {
    const doc = await DataService.get('documentos', id);
    if (!doc) return;

    currentDocId = id;
    document.getElementById('doc-detail-title').textContent = doc.name;
    document.getElementById('doc-detail-img').src = doc.image;
    document.getElementById('doc-detail-date').textContent = new Date(doc.createdAt).toLocaleDateString('es-ES');
    document.getElementById('doc-detail-modal').style.display = 'flex';
}

function closeDocDetailModal() {
    document.getElementById('doc-detail-modal').style.display = 'none';
    currentDocId = null;
}

async function deleteCurrentDoc() {
    if (currentDocId && confirm('¿Eliminar este documento?')) {
        await DataService.remove('documentos', currentDocId);
        closeDocDetailModal();
        loadDocumentsList();
        loadCazadorDocs();
        showToast('Documento eliminado', 'info');
    }
}

async function deleteDoc(id) {
    if (confirm('¿Eliminar este documento?')) {
        await DataService.remove('documentos', id);
        loadDocumentsList();
        loadCazadorDocs();
        showToast('Documento eliminado', 'info');
    }
}

// ============================================
// ESPECIES CINEGÉTICAS
// ============================================
function getAllSpecies() {
    const custom = LocalDB.get('species_custom') || [];
    const hidden = LocalDB.get('species_hidden') || [];
    const overrides = LocalDB.get('species_overrides') || {};
    const all = ESPECIES_CINEGETICAS.map(s => overrides[s.id] ? { ...s, ...overrides[s.id] } : s).concat(custom);
    return all.filter(s => !hidden.includes(s.id));
}

function isCustomSpecies(id) {
    const custom = LocalDB.get('species_custom') || [];
    return custom.some(s => s.id === id);
}

function renderSpecies(filter = 'todos') {
    currentSpeciesFilter = filter;
    const container = document.getElementById('species-grid');
    const allSpecies = getAllSpecies();

    let filtered = allSpecies;
    if (filter === 'mayor') filtered = allSpecies.filter(e => e.tipo === 'mayor');
    if (filter === 'menor') filtered = allSpecies.filter(e => e.tipo === 'menor');
    if (filter === 'custom') {
        const custom = LocalDB.get('species_custom') || [];
        filtered = custom;
    }

    const cazadas = LocalDB.get('especies_cazadas') || [];
    const customPhotos = LocalDB.get('species_custom_photos') || {};

    if (filter === 'cazadas') {
        filtered = allSpecies.filter(e => cazadas.includes(e.id));
    }

    container.innerHTML = filtered.map(sp => {
        const img = customPhotos[sp.id] || sp.imagen;
        const isCustom = isCustomSpecies(sp.id);
        const delBtn = isCustom ? `<button class="btn-delete-species" onclick="event.stopPropagation(); deleteSpecies('${sp.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>` : '';
        return `
        <div class="species-card ${cazadas.includes(sp.id) ? 'cazada' : ''} ${isCustom ? 'custom-species-card' : ''}"
             onclick="showSpeciesDetail('${sp.id}')">
            ${delBtn}
            <img class="species-img" src="${img}" alt="${sp.nombre}"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23132e18%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%236b9e70%22 font-family=%22sans-serif%22 font-size=%2220%22 text-anchor=%22middle%22 x=%22200%22 y=%22150%22%3E${encodeURIComponent(sp.nombre)}%3C/text%3E%3C/svg%3E'">
            <div class="species-info">
                <h4>${sp.nombre}</h4>
                <p>${sp.nombreCientifico}</p>
                <span class="species-type-badge ${sp.tipo === 'mayor' ? 'badge-mayor' : 'badge-menor'}">
                    ${sp.tipo === 'mayor' ? 'Caza Mayor' : 'Caza Menor'}
                </span>
            </div>
        </div>
    `}).join('');
}

function filterSpecies(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderSpecies(filter);
}

function showSpeciesDetail(id) {
    const sp = getAllSpecies().find(e => e.id === id);
    if (!sp) return;

    currentSpeciesId = id;
    const cazadas = LocalDB.get('especies_cazadas') || [];
    const customPhotos = LocalDB.get('species_custom_photos') || {};
    const isCazada = cazadas.includes(id);

    document.getElementById('species-detail-title').textContent = sp.nombre;
    document.getElementById('species-detail-img').src = customPhotos[id] || sp.imagen;
    document.getElementById('species-detail-img').onerror = function() {
        this.style.display = 'none';
    };

    document.getElementById('species-detail-info').innerHTML = `
        <div class="info-item">
            <label>Científico</label>
            <span>${sp.nombreCientifico}</span>
        </div>
        <div class="info-item">
            <label>Tipo</label>
            <span>${sp.tipo === 'mayor' ? 'Caza Mayor' : 'Caza Menor'}</span>
        </div>
        <div class="info-item">
            <label>Grupo</label>
            <span>${sp.grupo || '-'}</span>
        </div>
        <div class="info-item">
            <label>Temporada</label>
            <span>${sp.temporada}</span>
        </div>
        <div class="info-item" style="grid-column: 1/-1">
            <label>Descripción</label>
            <span>${sp.descripcion}</span>
        </div>
        <div class="info-item" style="grid-column: 1/-1">
            <label>Regulación</label>
            <span>${sp.regulateInfo}</span>
        </div>
    `;

    const btnCazada = document.getElementById('btn-marcar-cazada');
    if (isCazada) {
        btnCazada.innerHTML = '<i class="fas fa-times"></i> Desmarcar como Cazada';
        btnCazada.className = 'btn-danger';
    } else {
        btnCazada.innerHTML = '<i class="fas fa-check"></i> Marcar como Cazada';
        btnCazada.className = 'btn-primary';
    }

    const btnDelete = document.getElementById('btn-delete-species-detail');
    btnDelete.style.display = 'inline-flex';

    document.getElementById('species-detail-modal').style.display = 'flex';
}

function deleteSpeciesFromDetail() {
    if (!currentSpeciesId) return;
    deleteSpecies(currentSpeciesId);
    closeSpeciesModal();
}

function closeSpeciesModal() {
    document.getElementById('species-detail-modal').style.display = 'none';
    currentSpeciesId = null;
}

function toggleCazada() {
    if (!currentSpeciesId) return;

    let cazadas = LocalDB.get('especies_cazadas') || [];
    const index = cazadas.indexOf(currentSpeciesId);

    if (index > -1) {
        cazadas.splice(index, 1);
        showToast('Especie desmarcada', 'info');
    } else {
        cazadas.push(currentSpeciesId);
        showToast('¡Especie marcada como cazada!');
    }

    LocalDB.set('especies_cazadas', cazadas);
    closeSpeciesModal();
    renderSpecies(currentSpeciesFilter);
    updateDashboardStats();
}

let speciesPhotoData = null;

function openSpeciesPhotoModal() {
    speciesPhotoData = null;
    document.getElementById('species-photo-preview-container').style.display = 'none';
    document.getElementById('species-photo-preview').src = '';
    document.getElementById('btn-save-species-photo').disabled = true;
    document.getElementById('species-photo-modal').style.display = 'flex';
}

function closeSpeciesPhotoModal() {
    document.getElementById('species-photo-modal').style.display = 'none';
    speciesPhotoData = null;
}

function triggerSpeciesCamera() {
    const input = document.getElementById('species-file-input');
    input.onchange = function() {
        handleSpeciesFileSelect(this.files[0]);
    };
    input.click();
}

function triggerSpeciesGallery() {
    const input = document.getElementById('species-file-input-gallery');
    input.onchange = function() {
        handleSpeciesFileSelect(this.files[0]);
    };
    input.click();
}

function handleSpeciesFileSelect(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        speciesPhotoData = e.target.result;
        document.getElementById('species-photo-preview').src = speciesPhotoData;
        document.getElementById('species-photo-preview-container').style.display = 'block';
        document.getElementById('btn-save-species-photo').disabled = false;
    };
    reader.readAsDataURL(file);
}

function saveSpeciesPhoto() {
    if (!speciesPhotoData || !currentSpeciesId) return;

    const customPhotos = LocalDB.get('species_custom_photos') || {};
    customPhotos[currentSpeciesId] = speciesPhotoData;
    LocalDB.set('species_custom_photos', customPhotos);

    document.getElementById('species-detail-img').src = speciesPhotoData;
    closeSpeciesPhotoModal();
    renderSpecies(currentSpeciesFilter);
    showToast('Foto de especie actualizada');
}

function deleteSpecies(id) {
    if (!confirm('¿Eliminar esta especie?')) return;

    if (isCustomSpecies(id)) {
        let custom = LocalDB.get('species_custom') || [];
        custom = custom.filter(s => s.id !== id);
        LocalDB.set('species_custom', custom);

        const customPhotos = LocalDB.get('species_custom_photos') || {};
        delete customPhotos[id];
        LocalDB.set('species_custom_photos', customPhotos);
    } else {
        let hidden = LocalDB.get('species_hidden') || [];
        if (!hidden.includes(id)) {
            hidden.push(id);
            LocalDB.set('species_hidden', hidden);
        }
    }

    let cazadas = LocalDB.get('especies_cazadas') || [];
    cazadas = cazadas.filter(c => c !== id);
    LocalDB.set('especies_cazadas', cazadas);

    renderSpecies(currentSpeciesFilter);
    updateDashboardStats();
    showToast('Especie eliminada', 'info');
}

function showAddSpeciesForm() {
    editingSpeciesId = null;
    document.getElementById('sp-name').value = '';
    document.getElementById('sp-scientific').value = '';
    document.getElementById('sp-type').value = 'mayor';
    document.getElementById('sp-group').value = '2';
    document.getElementById('sp-season').value = '';
    document.getElementById('sp-description').value = '';
    document.getElementById('sp-regulation').value = '';
    document.getElementById('sp-image-url').value = '';
    document.getElementById('add-species-modal').querySelector('.modal-header h3').innerHTML = '<i class="fas fa-plus"></i> Nueva Especie';
    document.getElementById('btn-save-species-form').onclick = saveNewSpecies;
    document.getElementById('add-species-modal').style.display = 'flex';
}

function closeAddSpeciesForm() {
    document.getElementById('add-species-modal').style.display = 'none';
    editingSpeciesId = null;
    document.getElementById('add-species-modal').querySelector('.modal-header h3').innerHTML = '<i class="fas fa-plus"></i> Nueva Especie';
}

function saveNewSpecies() {
    const name = document.getElementById('sp-name').value.trim();
    if (!name) { showToast('Introduce un nombre', 'error'); return; }

    const scientific = document.getElementById('sp-scientific').value.trim() || 'Sin especificar';
    const type = document.getElementById('sp-type').value;
    const group = document.getElementById('sp-group').value;
    const season = document.getElementById('sp-season').value.trim() || 'Sin definir';
    const desc = document.getElementById('sp-description').value.trim() || '';
    const reg = document.getElementById('sp-regulation').value.trim() || '';
    const imgUrl = document.getElementById('sp-image-url').value.trim() || '';

    const id = 'custom-' + Date.now();
    const newSpecies = {
        id,
        nombre: name,
        nombreCientifico: scientific,
        tipo: type,
        imagen: imgUrl || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23132e18%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%236b9e70%22 font-family=%22sans-serif%22 font-size=%2218%22 text-anchor=%22middle%22 x=%22200%22 y=%22150%22%3E' + encodeURIComponent(name) + '%3C/text%3E%3C/svg%3E',
        grupo: group,
        temporada: season,
        descripcion: desc,
        regulateInfo: reg
    };

    let custom = LocalDB.get('species_custom') || [];
    custom.push(newSpecies);
    LocalDB.set('species_custom', custom);

    closeAddSpeciesForm();
    renderSpecies(currentSpeciesFilter);
    updateDashboardStats();
    showToast('Especie "' + name + '" añadida');
}

let editingSpeciesId = null;

function openEditSpeciesFromDetail() {
    if (!currentSpeciesId) return;
    const sp = getAllSpecies().find(e => e.id === currentSpeciesId);
    if (!sp) return;

    editingSpeciesId = currentSpeciesId;
    document.getElementById('add-species-modal').querySelector('.modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Editar Especie';
    document.getElementById('sp-name').value = sp.nombre || '';
    document.getElementById('sp-scientific').value = sp.nombreCientifico || '';
    document.getElementById('sp-type').value = sp.tipo || 'mayor';
    document.getElementById('sp-group').value = sp.grupo || '2';
    document.getElementById('sp-season').value = sp.temporada || '';
    document.getElementById('sp-description').value = sp.descripcion || '';
    document.getElementById('sp-regulation').value = sp.regulateInfo || '';
    document.getElementById('sp-image-url').value = (sp.imagen && sp.imagen.startsWith('http')) ? sp.imagen : '';
    document.getElementById('btn-save-species-form').onclick = saveEditedSpecies;
    document.getElementById('add-species-modal').style.display = 'flex';
}

function saveEditedSpecies() {
    const name = document.getElementById('sp-name').value.trim();
    if (!name) { showToast('Introduce un nombre', 'error'); return; }

    const scientific = document.getElementById('sp-scientific').value.trim() || 'Sin especificar';
    const type = document.getElementById('sp-type').value;
    const group = document.getElementById('sp-group').value;
    const season = document.getElementById('sp-season').value.trim() || 'Sin definir';
    const desc = document.getElementById('sp-description').value.trim() || '';
    const reg = document.getElementById('sp-regulation').value.trim() || '';
    const imgUrl = document.getElementById('sp-image-url').value.trim() || '';

    const updated = {
        nombre: name,
        nombreCientifico: scientific,
        tipo: type,
        imagen: imgUrl || null,
        grupo: group,
        temporada: season,
        descripcion: desc,
        regulateInfo: reg
    };

    if (isCustomSpecies(editingSpeciesId)) {
        let custom = LocalDB.get('species_custom') || [];
        custom = custom.map(s => s.id === editingSpeciesId ? { ...s, ...updated } : s);
        LocalDB.set('species_custom', custom);
    } else {
        let overrides = LocalDB.get('species_overrides') || {};
        overrides[editingSpeciesId] = updated;
        LocalDB.set('species_overrides', overrides);
    }

    closeAddSpeciesForm();
    editingSpeciesId = null;
    document.getElementById('add-species-modal').querySelector('.modal-header h3').innerHTML = '<i class="fas fa-plus"></i> Nueva Especie';
    closeSpeciesModal();
    renderSpecies(currentSpeciesFilter);
    showToast('Especie actualizada');
}

// ============================================
// PERROS
// ============================================
let editingDogId = null;
let dogPhotoData = null;

function showDogForm(dog = null) {
    dogPhotoData = null;
    document.getElementById('dog-foto-preview').innerHTML = '<i class="fas fa-dog"></i>';

    if (dog) {
        editingDogId = dog.id;
        document.getElementById('dog-form-title').innerHTML = '<i class="fas fa-edit"></i> Editar Perro';
        document.getElementById('dog-nombre').value = dog.nombre || '';
        document.getElementById('dog-raza').value = dog.raza || '';
        document.getElementById('dog-sexo').value = dog.sexo || 'macho';
        document.getElementById('dog-nacimiento').value = dog.nacimiento || '';
        document.getElementById('dog-microchip').value = dog.microchip || '';
        document.getElementById('dog-notas').value = dog.notas || '';
        if (dog.foto) {
            document.getElementById('dog-foto-preview').innerHTML = '<img src="' + dog.foto + '" alt="Foto">';
            dogPhotoData = dog.foto;
        }
    } else {
        editingDogId = null;
        document.getElementById('dog-form-title').innerHTML = '<i class="fas fa-dog"></i> Nuevo Perro';
        document.getElementById('dog-nombre').value = '';
        document.getElementById('dog-raza').value = '';
        document.getElementById('dog-sexo').value = 'macho';
        document.getElementById('dog-nacimiento').value = '';
        document.getElementById('dog-microchip').value = '';
        document.getElementById('dog-notas').value = '';
    }

    document.getElementById('dog-modal').style.display = 'flex';
}

function closeDogForm() {
    document.getElementById('dog-modal').style.display = 'none';
    editingDogId = null;
    dogPhotoData = null;
}

function triggerDogCamera() {
    const input = document.getElementById('dog-file-input');
    input.onchange = function() { handleDogFileSelect(this.files[0]); };
    input.click();
}

function triggerDogGallery() {
    const input = document.getElementById('dog-file-input-gallery');
    input.onchange = function() { handleDogFileSelect(this.files[0]); };
    input.click();
}

function handleDogFileSelect(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        dogPhotoData = e.target.result;
        document.getElementById('dog-foto-preview').innerHTML = '<img src="' + dogPhotoData + '" alt="Foto">';
    };
    reader.readAsDataURL(file);
}

async function saveDog() {
    const nombre = document.getElementById('dog-nombre').value.trim();
    if (!nombre) { showToast('Introduce un nombre', 'error'); return; }

    const id = editingDogId || 'dog_' + Date.now();
    const dog = {
        nombre: nombre,
        raza: document.getElementById('dog-raza').value.trim(),
        sexo: document.getElementById('dog-sexo').value,
        nacimiento: document.getElementById('dog-nacimiento').value,
        microchip: document.getElementById('dog-microchip').value.trim(),
        notas: document.getElementById('dog-notas').value.trim(),
        foto: dogPhotoData || null,
        createdAt: editingDogId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await DataService.save('perros', id, dog);
    closeDogForm();
    loadDogsList();
    showToast(editingDogId ? 'Perro actualizado' : 'Perro registrado');
}

async function loadDogsList() {
    const perros = await DataService.getAll('perros');
    const container = document.getElementById('cazador-perros');

    if (Object.keys(perros).length === 0) {
        container.innerHTML = '<p class="empty-state">No hay perros registrados</p>';
        return;
    }

    container.innerHTML = Object.entries(perros).map(([id, dog]) => {
        const fotoHtml = dog.foto
            ? '<img class="dog-thumb" src="' + dog.foto + '" alt="' + dog.nombre + '">'
            : '<div class="item-icon green"><i class="fas fa-dog"></i></div>';
        return `
        <div class="item-card">
            ${fotoHtml}
            <div class="item-info">
                <h4>${dog.nombre}</h4>
                <p>${dog.raza || 'Sin raza'} · ${dog.sexo === 'macho' ? '♂ Macho' : '♀ Hembra'}${dog.microchip ? ' · Chip: ' + dog.microchip : ''}</p>
            </div>
            <div class="item-actions">
                <button class="btn-icon" onclick="editDog('${id}')" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" onclick="deleteDog('${id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

async function editDog(id) {
    const dog = await DataService.get('perros', id);
    if (dog) {
        dog.id = id;
        showDogForm(dog);
    }
}

async function deleteDog(id) {
    if (confirm('¿Eliminar este perro?')) {
        await DataService.remove('perros', id);
        loadDogsList();
        showToast('Perro eliminado', 'info');
    }
}

// ============================================
// GOOGLE MAPS
// ============================================
function initGoogleMaps() {
    if (typeof google !== 'undefined' && google.maps) {
        console.log('Google Maps loaded');
    } else {
        console.warn('Google Maps not loaded. Add your API key.');
    }
}

function initGeneralMap() {
    const mapEl = document.getElementById('map-general');
    if (!mapEl) return;

    if (!generalMap) {
        const center = { lat: 40.0, lng: -3.7 };

        if (typeof google !== 'undefined' && google.maps) {
            generalMap = new google.maps.Map(mapEl, {
                center: center,
                zoom: 6,
                styles: getMapStyle(),
                mapTypeControl: true,
                fullscreenControl: true,
                streetViewControl: false
            });
        } else {
            mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#132e18;color:#6b9e70;flex-direction:column;gap:10px"><i class="fas fa-map-marked-alt" style="font-size:3rem"></i><p>Google Maps no disponible</p><p style="font-size:0.75rem">Añade tu API key de Google Maps en index.html</p></div>';
            return;
        }
    }

    loadMapMarkers();
}

async function loadMapMarkers() {
    if (!generalMap) return;

    allMarkers.forEach(m => m.setMap(null));
    allPolygons.forEach(p => p.setMap(null));
    allMarkers = [];
    allPolygons = [];

    const cotos = await DataService.getAll('cotos');
    const zonas = await DataService.getAll('zonas');

    Object.entries(cotos).forEach(([id, coto]) => {
        if (coto.lat && coto.lng) {
            const marker = new google.maps.Marker({
                position: { lat: coto.lat, lng: coto.lng },
                map: generalMap,
                title: coto.nombre,
                icon: {
                    url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="14" fill="#22c55e" stroke="#fff" stroke-width="2"/><text x="16" y="21" text-anchor="middle" font-size="16" fill="white">⛰</text></svg>'),
                    scaledSize: new google.maps.Size(32, 32)
                }
            });

            const info = new google.maps.InfoWindow({
                content: `<div style="color:#333;padding:4px"><strong>${coto.nombre}</strong><br><small>${coto.ubicacion || ''}</small><br><small>${coto.superficie ? coto.superficie + ' ha' : ''}</small></div>`
            });

            marker.addListener('click', () => info.open(generalMap, marker));
            allMarkers.push(marker);
        }
    });

    Object.entries(zonas).forEach(([id, zona]) => {
        if (zona.points && zona.points.length >= 3) {
            const polygon = new google.maps.Polygon({
                paths: zona.points,
                map: generalMap,
                strokeColor: '#ef4444',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#ef4444',
                fillOpacity: 0.15,
                editable: false
            });

            const info = new google.maps.InfoWindow({
                content: `<div style="color:#333;padding:4px"><strong>${zona.nombre}</strong><br><small>${zona.especies || ''}</small></div>`
            });

            polygon.addListener('click', (e) => {
                info.setPosition(e.latLng);
                info.open(generalMap);
            });

            allPolygons.push(polygon);
        }

        if (zona.center) {
            const marker = new google.maps.Marker({
                position: zona.center,
                map: generalMap,
                title: zona.nombre,
                icon: {
                    url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><circle cx="14" cy="14" r="12" fill="#3b82f6" stroke="#fff" stroke-width="2"/><text x="14" y="18" text-anchor="middle" font-size="12" fill="white">📍</text></svg>'),
                    scaledSize: new google.maps.Size(28, 28)
                }
            });
            allMarkers.push(marker);
        }
    });
}

function initCotoMap() {
    const mapEl = document.getElementById('map-coto');
    if (!mapEl || cotoMap) return;

    const center = { lat: 40.0, lng: -3.7 };

    if (typeof google !== 'undefined' && google.maps) {
        cotoMap = new google.maps.Map(mapEl, {
            center: center,
            zoom: 8,
            styles: getMapStyle()
        });

        cotoMap.addListener('click', function(e) {
            if (cotoMarker) cotoMarker.setMap(null);
            cotoMarker = new google.maps.Marker({
                position: e.latLng,
                map: cotoMap,
                icon: {
                    url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><circle cx="18" cy="18" r="16" fill="#22c55e" stroke="#fff" stroke-width="3"/></svg>'),
                    scaledSize: new google.maps.Size(36, 36)
                }
            });
        });
    }
}

function initZonaMap() {
    const mapEl = document.getElementById('map-zona');
    if (!mapEl || zonaMap) return;

    const center = { lat: 40.0, lng: -3.7 };

    if (typeof google !== 'undefined' && google.maps) {
        zonaMap = new google.maps.Map(mapEl, {
            center: center,
            zoom: 10,
            styles: getMapStyle()
        });

        zonaMap.addListener('click', function(e) {
            const marker = new google.maps.Marker({
                position: e.latLng,
                map: zonaMap,
                icon: {
                    url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="8" fill="#ef4444" stroke="#fff" stroke-width="2"/></svg>'),
                    scaledSize: new google.maps.Size(20, 20)
                }
            });
            zonaMarkers.push(marker);
            updateZonaPolygon();
        });

        google.maps.event.addListener(zonaMap, 'dblclick', function(e) {
            e.preventDefault();
            if (zonaMarkers.length >= 3) {
                updateZonaPolygon();
            }
        });
    }
}

function updateZonaPolygon() {
    if (zonaPolygon) zonaPolygon.setMap(null);
    if (zonaMarkers.length < 3) return;

    const path = zonaMarkers.map(m => m.getPosition());

    zonaPolygon = new google.maps.Polygon({
        paths: path,
        map: zonaMap,
        strokeColor: '#ef4444',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.2,
        editable: true
    });
}

function getMapStyle() {
    return [
        { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
        { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
        { featureType: "land", elementType: "geometry", stylers: [{ color: "#16213e" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283e59" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6f9ba5" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c6675" }] },
        { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4e6d70" }] }
    ];
}

function verTodosCotos() {
    document.querySelectorAll('.map-controls .btn-sm').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-ver-todos').classList.add('active');
    loadMapMarkers();
}

function verCotosEnMapa() {
    document.querySelectorAll('.map-controls .btn-sm').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-ver-cotos').classList.add('active');
    allPolygons.forEach(p => p.setMap(null));
}

function verZonasEnMapa() {
    document.querySelectorAll('.map-controls .btn-sm').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-ver-zonas').classList.add('active');
    allMarkers.forEach(m => m.setMap(null));
}

// ============================================
// DASHBOARD
// ============================================
async function updateDashboardStats() {
    const cazador = await DataService.get('cazador', 'perfil');
    const cotos = await DataService.getAll('cotos');
    const armas = await DataService.getAll('armas');
    const jornadas = await DataService.getAll('jornadas');
    const zonas = await DataService.getAll('zonas');

    document.getElementById('stat-cazador').textContent = cazador && cazador.nombre ? '1' : '0';
    document.getElementById('stat-cotos').textContent = Object.keys(cotos).length;
    document.getElementById('stat-armas').textContent = Object.keys(armas).length;
    document.getElementById('stat-especies').textContent = getAllSpecies().length;

    document.getElementById('season-jornadas').textContent = Object.keys(jornadas).length;
    document.getElementById('season-zonas').textContent = Object.keys(zonas).length;

    const totalCapturas = Object.values(jornadas).reduce((sum, j) => {
        return sum + (j.especiesCazadas ? j.especiesCazadas.length : 0);
    }, 0);
    document.getElementById('season-capturas').textContent = totalCapturas;

    // Activity feed
    loadRecentActivity(jornadas, cotos);
}

async function loadRecentActivity(jornadas, cotos) {
    const container = document.getElementById('activity-list');
    const sorted = Object.entries(jornadas)
        .sort((a, b) => (b[1].updatedAt || '').localeCompare(a[1].updatedAt || ''))
        .slice(0, 5);

    if (sorted.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay actividad reciente</p>';
        return;
    }

    container.innerHTML = sorted.map(([id, j]) => {
        const coto = cotos[j.cotoId];
        const spCount = j.especiesCazadas ? j.especiesCazadas.length : 0;
        return `
            <div class="activity-item">
                <div class="activity-icon blue"><i class="fas fa-book"></i></div>
                <div class="activity-info">
                    <strong>Jornada de ${j.tipo || 'caza'}</strong>
                    <p>${j.fecha || ''} · ${coto ? coto.nombre : ''} · ${spCount} captura(s)</p>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// INITIALIZATION
// ============================================
async function initApp() {
    await DataService.init();
    await loadCazador();
    await loadCotosList();
    await loadArmasList();
    await loadZonasList();
    await renderSpecies();
    await updateDashboardStats();
    await loadCazadorDocs();

    initGoogleMaps();
    console.log('Cazatec initialized');
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
