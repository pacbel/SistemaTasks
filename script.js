// Função para carregar o progresso salvo
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateProgressBar();
    
    // Adicionar event listeners para todos os checkboxes
    const checkboxes = document.querySelectorAll('.rf-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateProgressBar();
            autoSaveProgress();
        });
    });
});

// Função para atualizar a barra de progresso
function updateProgressBar() {
    const checkboxes = document.querySelectorAll('.rf-checkbox');
    const totalCheckboxes = checkboxes.length;
    let checkedCheckboxes = 0;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedCheckboxes++;
        }
    });
    
    const progressPercentage = Math.round((checkedCheckboxes / totalCheckboxes) * 100);
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progressPercentage + '%';
    progressBar.textContent = progressPercentage + '%';
}

// Função para salvar o progresso no servidor automaticamente
function autoSaveProgress() {
    const checkboxes = document.querySelectorAll('.rf-checkbox');
    const progress = {};
    
    checkboxes.forEach(checkbox => {
        progress[checkbox.id] = checkbox.checked;
    });
    
    // Backup local em caso de falha na conexão
    localStorage.setItem('specProgressBackup', JSON.stringify(progress));
    
    // Enviar para o servidor
    fetch('/api/progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress)
    })
    .catch(error => {
        console.error('Erro ao salvar progresso no servidor:', error);
    });
}

// Função para salvar o progresso no servidor com confirmação
function saveProgress() {
    const checkboxes = document.querySelectorAll('.rf-checkbox');
    const progress = {};
    
    checkboxes.forEach(checkbox => {
        progress[checkbox.id] = checkbox.checked;
    });
    
    // Backup local em caso de falha na conexão
    localStorage.setItem('specProgressBackup', JSON.stringify(progress));
    
    // Enviar para o servidor com feedback visual
    fetch('/api/progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao salvar no servidor');
        }
        return response.json();
    })
    .then(() => {
        alert('Progresso salvo com sucesso no servidor!');
    })
    .catch(error => {
        console.error('Erro ao salvar progresso no servidor:', error);
        alert('Erro ao salvar no servidor. Um backup foi salvo localmente.');
    });
}

// Função para carregar o progresso do servidor
function loadProgress() {
    // Mostrar indicador de carregamento
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.textContent = 'Carregando...';
    }
    
    // Tentar carregar do servidor
    fetch('/api/progress')
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao carregar do servidor');
            }
            return response.json();
        })
        .then(progress => {
            applyProgress(progress);
        })
        .catch(error => {
            console.error('Erro ao carregar progresso do servidor:', error);
            // Fallback para o backup local se houver falha na conexão
            const savedProgress = localStorage.getItem('specProgressBackup');
            if (savedProgress) {
                try {
                    const progress = JSON.parse(savedProgress);
                    applyProgress(progress);
                    console.log('Carregado do backup local');
                } catch (e) {
                    console.error('Erro ao carregar do backup local:', e);
                }
            }
        });
}

// Função auxiliar para aplicar o progresso aos checkboxes
function applyProgress(progress) {
    const checkboxes = document.querySelectorAll('.rf-checkbox');
    
    checkboxes.forEach(checkbox => {
        if (progress[checkbox.id] !== undefined) {
            checkbox.checked = progress[checkbox.id];
        }
    });
    
    // Atualizar a barra de progresso
    updateProgressBar();
}

// Função para baixar o progresso como arquivo JSON
function downloadProgress() {
    // Mostrar indicador de carregamento
    const statusElement = document.createElement('div');
    statusElement.style.position = 'fixed';
    statusElement.style.top = '50%';
    statusElement.style.left = '50%';
    statusElement.style.transform = 'translate(-50%, -50%)';
    statusElement.style.padding = '10px';
    statusElement.style.backgroundColor = '#f8f9fa';
    statusElement.style.border = '1px solid #ccc';
    statusElement.style.borderRadius = '5px';
    statusElement.style.zIndex = '1000';
    statusElement.textContent = 'Obtendo dados do servidor...';
    document.body.appendChild(statusElement);
    
    // Tentar obter do servidor primeiro
    fetch('/api/progress')
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao carregar do servidor');
            }
            return response.json();
        })
        .then(progress => {
            // Criar e baixar o arquivo
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "sistema_gestao_clinica_progresso.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            statusElement.remove();
        })
        .catch(error => {
            console.error('Erro ao obter progresso do servidor:', error);
            statusElement.textContent = 'Usando dados locais...';
            
            // Fallback para dados locais
            setTimeout(() => {
                const checkboxes = document.querySelectorAll('.rf-checkbox');
                const progress = {};
                
                checkboxes.forEach(checkbox => {
                    progress[checkbox.id] = checkbox.checked;
                });
                
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "sistema_gestao_clinica_progresso.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
                statusElement.remove();
            }, 1000);
        });
}

// Função para importar progresso
function importProgress() {
    const fileInput = document.getElementById('importFile');
    fileInput.click();
}

// Função para lidar com o arquivo importado
function handleImport(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const progress = JSON.parse(e.target.result);
                
                // Aplicar o progresso aos checkboxes
                const checkboxes = document.querySelectorAll('.rf-checkbox');
                checkboxes.forEach(checkbox => {
                    if (progress[checkbox.id] !== undefined) {
                        checkbox.checked = progress[checkbox.id];
                    }
                });
                
                // Atualizar a interface
                updateProgressBar();
                
                // Enviar para o servidor
                fetch('/api/progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(progress)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Falha ao salvar no servidor');
                    }
                    return response.json();
                })
                .then(() => {
                    alert('Progresso importado e salvo no servidor com sucesso!');
                })
                .catch(error => {
                    console.error('Erro ao salvar progresso importado no servidor:', error);
                    // Backup local em caso de falha
                    localStorage.setItem('specProgressBackup', JSON.stringify(progress));
                    alert('Progresso importado localmente, mas houve erro ao salvar no servidor.');
                });
            } catch (error) {
                alert('Erro ao importar arquivo: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    input.value = ''; // Limpar o input para permitir carregar o mesmo arquivo novamente
}

// Função para marcar todos os checkboxes
function checkAll() {
    const checkboxes = document.querySelectorAll('.rf-checkbox');
    const shouldCheck = confirm('Deseja marcar todos os itens como concluídos?');
    
    if (shouldCheck !== null) {
        // Aplicar a alteração aos checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.checked = shouldCheck;
        });
        
        // Atualizar a interface
        updateProgressBar();
        
        // Preparar os dados para envio
        const progress = {};
        checkboxes.forEach(checkbox => {
            progress[checkbox.id] = checkbox.checked;
        });
        
        // Backup local em caso de falha na conexão
        localStorage.setItem('specProgressBackup', JSON.stringify(progress));
        
        // Enviar para o servidor
        fetch('/api/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(progress)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao salvar no servidor');
            }
            return response.json();
        })
        .then(() => {
            console.log('Alteração em massa salva no servidor com sucesso');
        })
        .catch(error => {
            console.error('Erro ao salvar alteração em massa no servidor:', error);
            alert('Erro ao salvar no servidor. Um backup foi salvo localmente.');
        });
    }
}
