document.addEventListener('DOMContentLoaded', function() {
    const shiftSelect = document.getElementById('shiftSelect');
    const careerSelect = document.getElementById('careerSelect');
    const schedulesContainer = document.getElementById('schedulesContainer');
    const scheduleTitle = document.getElementById('scheduleTitle');
    
    // Configuración de grupos por carrera y turno
    const gruposPorCarreraTurno = {
        'automotriz': {
            'matutino': 3,   // 3 grupos en Mantenimiento Automotriz matutino
            'vespertino': 6  // 6 grupos en Mantenimiento Automotriz vespertino
        },
        'laboratorista': {
            'matutino': 3,   // 3 grupos en Laboratorista Clínico matutino
            'vespertino': 4  // 4 grupos en Laboratorista Clínico vespertino
        },
        'contabilidad': {
            'matutino': 6,   // 6 grupos en Contabilidad matutino
            'vespertino': 5  // 5 grupos en Contabilidad vespertino
        },
        'alimentos': {
            'matutino': 5,   // 5 grupos en Preparación de Alimentos y Bebidas matutino
            'vespertino': 4  // 4 grupos en Preparación de Alimentos y Bebidas vespertino
        },
        'electronica': {
            'vespertino': 4  // 4 grupos en Electrónica (solo vespertino)
        }
    };
    
    // Mapeo de nombres de carreras
    const careerNames = {
        'automotriz': 'Mantenimiento Automotriz',
        'laboratorista': 'Laboratorista Clínico',
        'contabilidad': 'Contabilidad',
        'alimentos': 'Preparación de Alimentos y Bebidas',
        'electronica': 'Electrónica'
    };
    
    // Mapeo de nombres de turnos
    const shiftNames = {
        'matutino': 'Matutino',
        'vespertino': 'Vespertino'
    };
    
    // URLs de los archivos PDF (debes actualizar estas rutas)
    const pdfUrls = {
        'automotriz': {
            'matutino': {
                1: '../horario/pdf/1A MAutomotriz.pdf',
                2: '../horario/pdf/.pdf',
                3: '../horario/pdf/.pdf'
            },
            'vespertino': {
                1: 'pdf/automotriz_vespertino_grupo1.pdf',
                2: 'pdf/automotriz_vespertino_grupo2.pdf',
                3: 'pdf/automotriz_vespertino_grupo3.pdf',
                4: 'pdf/automotriz_vespertino_grupo4.pdf',
                5: 'pdf/automotriz_vespertino_grupo5.pdf',
                6: 'pdf/automotriz_vespertino_grupo6.pdf'
            }
        },
        'laboratorista': {
            'matutino': {
                1: 'pdf/laboratorista_matutino_grupo1.pdf',
                2: 'pdf/laboratorista_matutino_grupo2.pdf',
                3: 'pdf/laboratorista_matutino_grupo3.pdf'
            },
            'vespertino': {
                1: 'pdf/laboratorista_vespertino_grupo1.pdf',
                2: 'pdf/laboratorista_vespertino_grupo2.pdf',
                3: 'pdf/laboratorista_vespertino_grupo3.pdf',
                4: 'pdf/laboratorista_vespertino_grupo4.pdf'
            }
        },
        'contabilidad': {
            'matutino': {
                1: 'pdf/contabilidad_matutino_grupo1.pdf',
                2: 'pdf/contabilidad_matutino_grupo2.pdf',
                3: 'pdf/contabilidad_matutino_grupo3.pdf',
                4: 'pdf/contabilidad_matutino_grupo4.pdf',
                5: 'pdf/contabilidad_matutino_grupo5.pdf',
                6: 'pdf/contabilidad_matutino_grupo6.pdf'
            },
            'vespertino': {
                1: 'pdf/contabilidad_vespertino_grupo1.pdf',
                2: 'pdf/contabilidad_vespertino_grupo2.pdf',
                3: 'pdf/contabilidad_vespertino_grupo3.pdf',
                4: 'pdf/contabilidad_vespertino_grupo4.pdf',
                5: 'pdf/contabilidad_vespertino_grupo5.pdf'
            }
        },
        'alimentos': {
            'matutino': {
                1: 'pdf/alimentos_matutino_grupo1.pdf',
                2: 'pdf/alimentos_matutino_grupo2.pdf',
                3: 'pdf/alimentos_matutino_grupo3.pdf',
                4: 'pdf/alimentos_matutino_grupo4.pdf',
                5: 'pdf/alimentos_matutino_grupo5.pdf'
            },
            'vespertino': {
                1: 'pdf/alimentos_vespertino_grupo1.pdf',
                2: 'pdf/alimentos_vespertino_grupo2.pdf',
                3: 'pdf/alimentos_vespertino_grupo3.pdf',
                4: 'pdf/alimentos_vespertino_grupo4.pdf'
            }
        },
        'electronica': {
            'vespertino': {
                1: 'pdf/electronica_vespertino_grupo1.pdf',
                2: 'pdf/electronica_vespertino_grupo2.pdf',
                3: 'pdf/electronica_vespertino_grupo3.pdf',
                4: 'pdf/electronica_vespertino_grupo4.pdf'
            }
        }
    };
    
    // Event listener para cuando cambia el turno
    shiftSelect.addEventListener('change', function() {
        const selectedShift = this.value;
        
        // Si se selecciona "matutino", deshabilitar la opción de Electrónica
        if (selectedShift === 'matutino') {
            const electronicaOption = careerSelect.querySelector('option[value="electronica"]');
            electronicaOption.disabled = true;
            
            // Si Electrónica estaba seleccionada, cambiarla a vacío
            if (careerSelect.value === 'electronica') {
                careerSelect.value = '';
                generateSchedules();
            }
        } 
        // Si se selecciona "vespertino" o se borra la selección, habilitar Electrónica
        else {
            const electronicaOption = careerSelect.querySelector('option[value="electronica"]');
            electronicaOption.disabled = false;
        }
        
        generateSchedules();
    });
    
    // Event listener para cuando cambia la carrera
    careerSelect.addEventListener('change', generateSchedules);
    
    // Función para obtener el número de grupos según carrera y turno
    function getNumeroGrupos(career, shift) {
        if (gruposPorCarreraTurno[career] && gruposPorCarreraTurno[career][shift]) {
            return gruposPorCarreraTurno[career][shift];
        }
        return 0;
    }
    
    // Función para generar horarios
    function generateSchedules() {
        const shift = shiftSelect.value;
        const career = careerSelect.value;
        
        // Validación para Electrónica en turno matutino
        if (career === 'electronica' && shift === 'matutino') {
            schedulesContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        La carrera de Electrónica solo está disponible en el turno vespertino.
                    </div>
                </div>
            `;
            return;
        }
        
        if (!shift || !career) {
            schedulesContainer.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Selecciona un turno y una carrera para ver los horarios disponibles</p></div>';
            return;
        }
        
        // Obtener número de grupos para esta carrera y turno
        const numGrupos = getNumeroGrupos(career, shift);
        
        if (numGrupos === 0) {
            schedulesContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="fas fa-info-circle me-2"></i>
                        No hay grupos disponibles para ${careerNames[career]} en el turno ${shiftNames[shift]}.
                    </div>
                </div>
            `;
            return;
        }
        
        
        // Generar horarios para los grupos
        let schedulesHTML = '';
        
        for (let group = 1; group <= numGrupos; group++) {
            // Verificar si existe el PDF para este grupo
            const pdfExists = pdfUrls[career] && pdfUrls[career][shift] && pdfUrls[career][shift][group];
            
            schedulesHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="schedule-card">
                    <div class="schedule-card-header">
                        Grupo ${group} - ${shiftNames[shift]}
                    </div>
                    <div class="schedule-card-body">
                        <h5 class="card-title">${careerNames[career]}</h5>
                        <p class="card-text">Horario para el grupo ${group} del turno ${shiftNames[shift]}</p>
                        <div class="d-grid gap-2">
            `;
            
            if (pdfExists) {
                schedulesHTML += `
                            <a href="${pdfUrls[career][shift][group]}" class="btn btn-download" target="_blank">
                                <i class="fas fa-download me-2"></i>Descargar Horario
                            </a>
                `;
            } else {
                schedulesHTML += `
                            <button class="btn btn-secondary" disabled>
                                <i class="fas fa-clock me-2"></i>Próximamente
                            </button>
                `;
            }
            
            schedulesHTML += `
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        
        schedulesContainer.innerHTML = schedulesHTML;
    }
    
    // Inicializar el estado de la opción de Electrónica al cargar la página
    const electronicaOption = careerSelect.querySelector('option[value="electronica"]');
    electronicaOption.disabled = (shiftSelect.value === 'matutino');
});