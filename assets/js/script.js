$(document).ready(function() {
    const apiToken = '71a310d1d9d9b1aaaf2d206fae434106';
    const apiUrl = 'https://www.superheroapi.com/api.php/' + apiToken + '/';

    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        // Obtener el valor ingresado por el usuario en el Input
        const heroId = $('#hero-id').val();

        // Validación para asegurarse de que solo se ingresen números
        if (!/^\d+$/.test(heroId)) {
            alert('Por favor, ingresa un número válido.');
            return;
        }

        // Llamada AJAX a la API de SuperHero
        $.ajax({
            url: apiUrl + heroId,
            type: 'GET',
            success: function(response) {
                renderHeroData(response);
            },
            error: function() {
                alert('Hubo un error al obtener los datos. Inténtalo de nuevo.');
            }
        });
    });

    // Función para renderizar la información del héroe
    function renderHeroData(hero) {
        console.log(hero);
        const heroCard = `
            <div class="card mb-4">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${hero.image.url}" class="card-img" alt="${hero.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${hero.name}</h5>
                            <hr>
                            <p class="card-text"><strong>Conexiones:</strong> ${hero.connections['group-affiliation']}</p>
                            <hr>
                            <p class="card-text"><strong>Publicado por:</strong> ${hero.biography.publisher}</p>
                            <hr>
                            <p class="card-text"><strong>Ocupación:</strong> ${hero.work.occupation}</p>
                            <hr>
                            <p class="card-text"><strong>Primera Aparición:</strong> ${hero.biography['first-appearance']}</p>
                            <hr>
                            <p class="card-text"><strong>Altura:</strong> ${hero.appearance.height.join(' / ')}</p>
                            <hr>
                            <p class="card-text"><strong>Peso:</strong> ${hero.appearance.weight.join(' / ')}</p>
                            <hr>
                            <p class="card-text"><strong>Alianzas:</strong> ${hero.biography.aliases.join(', ')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="chartContainer" style="height: 370px; width: 100%;"></div>
        `;

        // Agregar la tarjeta del héroe al div de resultados
        $('#hero-result').html(heroCard);

        // Asegurarse de que el chartContainer esté en el DOM antes de intentar renderizar
        setTimeout(() => {
            // Verificar si el contenedor del gráfico existe antes de intentar inicializar el gráfico
            if (document.getElementById('chartContainer')) {
                const statsData = [
                    { y: parseInt(hero.powerstats.intelligence), label: "Intelligence", legendText: "Intelligence" },
                    { y: parseInt(hero.powerstats.strength), label: "Strength", legendText: "Strength" },
                    { y: parseInt(hero.powerstats.speed), label: "Speed", legendText: "Speed" },
                    { y: parseInt(hero.powerstats.durability), label: "Durability", legendText: "Durability" },
                    { y: parseInt(hero.powerstats.power), label: "Power", legendText: "Power" },
                    { y: parseInt(hero.powerstats.combat), label: "Combat", legendText: "Combat" }
                ];
        
                const chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    theme: "light2",
                    title: {
                        text: `Estadísticas de Poder para ${hero.name}`
                    },
                    data: [{
                        type: "pie",
                        showInLegend: true,
                        toolTipContent: "<b>{label}</b>: {y} (#percent%)",
                        indexLabel: "{label} - #percent%",
                        dataPoints: statsData
                    }]
                });
                chart.render();
            } else {
                console.error('El contenedor del gráfico no se encontró en el DOM.');
            }
        }, 0);
    }
});
