$(document).ready(function () {

    var cityList = [];
    var m = moment();

    function searchHistory() {
        $("#search-history").empty();

        for (var i = 0; i < cityList.length; i++) {
            var searchButton = $("<button>");
            searchButton.addClass("city-btn");
            searchButton.attr("data-name", cityList[i]);
            searchButton.text(cityList[i]);
            $("#search-history").append(searchButton);
        }

        getWeather(cityList[cityList.length - 1])
    }


    $("#cityhistory").on("click", function (event) {
        event.preventDefault();

        var city = $("#insert-city").val();
        if (city) {
            // Add city to array of city names
            cityList.push(city);
            $("#insert-city").val("");

            searchHistory();
        }
    });

    // display current weather
    function currentWeather(city) {

        var weatherAPI = "590e0106c66004c0b5fb83f560dac99c";
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + weatherAPI;

        $.ajax({
            url: weatherURL,
            method: "GET"
        }).then(function (response) {
            var currentWeather = $("<div class='current-weather'>");

            var date = m.format("MM/DD/YYYY");
            var p1 = $("<p>").text(date);
            currentWeather.append(p1);

            var cityMain = response.name;
            var p2 = $("<p>").text(cityMain);
            currentWeather.append(p2);

            // issue : revisit here. API call only displays over 200F all cities

            var temperature = response.main.temp;
            var p3 = $("<p>").text("Temperature: " + temperature + "°F");
            currentWeather.append(p3);

            var humidity = response.main.humidity;
            var p4 = $("<p>").text("Humidity: " + humidity + "%");
            currentWeather.append(p4);

            var windSpeed = response.wind.speed;
            var p5 = $("<p>").text("Wind Speed: " + windSpeed + " MPH")
            currentWeather.append(p5);

            var lat = response.coord.lat;
            var lon = response.coord.lon;


            //display UV index
            function uvIndex() {

                var weatherAPI = "590e0106c66004c0b5fb83f560dac99c";
                var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + weatherAPI;

                $.ajax({
                    url: uvIndexURL,
                    method: "GET"
                }).then(function (response) {

                    var p6 = $("<p class='uv-index'>").text("UV Index: " + response.value);

                    currentWeather.append(p6);

                    $("#current-weather-display").html(currentWeather);
                })
            }
            uvIndex();
        });
    }



    function displayWeather(city) {
        if (typeof city === 'object') {
            city = $(this).attr("data-name");
        }
        currentWeather(city);
        fiveDayForecast(city);
    }

    // Display five day forecast
    function fiveDayForecast(city) {
        var fiveDaysURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&units=imperial&APPID=590e0106c66004c0b5fb83f560dac99c";

        $.ajax({
            url: fiveDaysURL,
            method: "GET"
        }).then(function (response) {
            var mainTemps = [];
            for (var i = 0; i < response.list.length; i += 8) {
                mainTemps.push(response.list[i].main.temp);
            }

            for (var i = 0; i < mainTemps.length; i++) {
                var temp = mainTemps[i];
                var parent = $("<div>");
                var child = $("<p>").text("Temp: " + temp + "°F");
                parent.append(child);
                $("#day-" + (i + 1).toString()).html(parent);
            }

            var fcstHumidity = [];
            for (var i = 0; i < response.list.length; i += 8) {
                fcstHumidity.push(response.list[i].main.humidity);
            }

            for (var i = 0; i < fcstHumidity.length; i++) {
                var humidity = fcstHumidity[i];
                var parent = $("<div>");
                var child = $("<p>").text("Humidity: " + humidity + "%");
                parent.append(child);
                $("#day-" + (i + 1).toString()).append(parent);
            }

            var icons = [];
            for (var i = 0; i < response.list.length; i += 8) {
                icons.push(response.list[i].weather[0].icon);
            }

            for (var i = 0; i < icons.length; i++) {
                var icon = "https://openweathermap.org/img/w/" + icons[i] + ".png";
                var iconDisplay = $("<div>");
                var iconImg = $("<img>").attr("src", icon);
                iconDisplay.append(iconImg);
                $("#day-" + (i + 1)).append(iconImg);
            }
            function displayDates() {
                var fiveDays = [];
                var date = moment().format("MM/DD/YYYY");
                var date1 = moment().add(1, 'd').format("MM/DD/YYYY");
                var date2 = moment().add(2, 'd').format("MM/DD/YYYY");
                var date3 = moment().add(3, 'd').format("MM/DD/YYYY");
                var date4 = moment().add(4, 'd').format("MM/DD/YYYY");

                fiveDays.push(date, date1, date2, date3, date4);

                for (var i = 0; i < fiveDays.length; i++) {
                    var eachDate = fiveDays[i];
                    var dateDisplay = $("<div>");
                    var eachDateDisplay = $("<p>").text(eachDate);
                    dateDisplay.append(eachDateDisplay);
                    $("#day-" + (i + 1)).append(eachDateDisplay);
                }
            }
            displayDates();
        });

    }

    $(document).on("click", ".city-btn", displayWeather);

});
