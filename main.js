document.onreadystatechange = () => {
    function roundTo(num, places) {
        return +(Math.round(num + "e+" + places) + "e-" + places);
    }

    function getStartLevel(endLevel, stage, totalPasses, usePremium, useCracker) {
        let level = endLevel
        let remainingPasses = totalPasses;
        let remainingHours = 0;

        while (remainingPasses > 0 || remainingHours > 12) {
            if (remainingHours == 0) {
                remainingPasses -= Math.max(stage, 1);
                remainingHours = 12;
            }

            level -= getExpPerHour(level, usePremium, useCracker);
            remainingHours -= 1;
        }

        return roundTo(level, 4);
    }

    function getExpPerHour(level, usePremium, useCracker) {
        let exp = 0

        if (1 <= level && level < 50) exp = 7.5;
        else if (50 <= level && level < 100) exp = 5;
        else if (100 <= level && level < 140) exp = 2.5;
        else if (140 <= level && level < 160) exp = 1.25;
        else if (160 <= level && level < 170) exp = 0.25;
        else if (170 <= level && level < 180) exp = 0.05;
        else if (180 <= level && level < 190) exp = 0.025;
        else if (level >= 190) exp = 0.0125;

        let bonus = 1;
        if (usePremium === true) bonus += 3;
        if (useCracker === true) bonus *= 2;

        return exp * bonus;
    }

    function calcPasses(startLvl, endLvl, stage, usePremium, useCracker) {
        let totalPasses = 0;
        let remainingHours = 0;
        let level = startLvl;

        while (level < endLvl || remainingHours > 0) {
            if (remainingHours == 0) {
                totalPasses += Math.max(stage, 1);
                remainingHours = 12;
            }

            level = level + getExpPerHour(level, usePremium, useCracker);
            remainingHours -= 1;
        }

        return { totalPasses: totalPasses, level: roundTo(level, 5) };
    }

    function calculate() {
        const startLvl = Number(document.getElementById("startLvl").value);
        const endLvl = Number(document.getElementById("endLvl").value);
        const stage = Number(document.getElementById("stage").value);
        const usePremium = Boolean(document.getElementById("premium").checked);
        const useCracker = Boolean(document.getElementById("cracker").checked);
        const passType = (usePremium === true) ? " premium" : " normal";
        let ender = (useCracker === true) ? " using crackers" : "";
        const result = calcPasses(startLvl, endLvl, stage, usePremium, useCracker);
        const plural = (result.totalPasses > 1) ? "es" : "";

        // TODO
        // if end exp is greater than 4 * exp_per_hour then it should be pretty
        // easy to save one pass
        // const hintCheck = result.level - Math.trunc(result.level) >= 4 * getExpPerHour(result.level, usePremium, useCracker);
        // const hintLvl = getStartLevel(endLvl, stage, result.totalPasses, usePremium, useCracker);
        // if (hintCheck === true) ender += "<br><br>Hint: If you manually leveled your pet to " + hintLvl + " before placing in the farm, you can save " + Math.max(stage, 1) + " pass";
        // if (stage > 1 && hintCheck === true) ender += "es";

        const out = "It would take " + result.totalPasses + passType + " pass" + plural + " (" + result.totalPasses / Math.max(1, stage) * 12 + " hours) to level your s" + stage + " pet from " + startLvl + " to " + result.level + ender;
        document.getElementById("result").innerHTML = out;
    }

    document.getElementById("petDetails").onsubmit = (e) => {
        e.preventDefault();
        calculate();
    };

    document.getElementById("useOnePass").onclick = () => {
        const next = roundTo(Number(document.getElementById("startLvl").value) + 0.01, 2);
        document.getElementById("endLvl").value = next;
        calculate();
    };
};