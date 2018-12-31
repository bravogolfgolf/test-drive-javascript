(function () {
    "use strict";

    require("geckodriver");

    var assert = require("../js/shared/assert");
    var webdriver = require('selenium-webdriver');

    describe("Selenium should", function () {

        it("draw line in drawing area", function (done) {

            var driver = new webdriver.Builder()
                .withCapabilities(webdriver.Capabilities.firefox())
                .build();

            driver.get('http://www.google.com');

            var searchBox = driver.findElement(webdriver.By.name('q'));
            searchBox.sendKeys('simple programmer');
            searchBox.getAttribute('value').then(function (value) {
                assert.equal(value, 'simple programmer');
            });

            driver.quit();
            done();
        });
    });
}());