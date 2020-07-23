document.onreadystatechange = () => {
    function roundTo(num, places) {
        return +(Math.round(num + "e+" + places) + "e-" + places);
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
        if (useCracker === true) bonus += 1;

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

            const exp = getExpPerHour(level, usePremium, useCracker);
            level = level + exp;
            remainingHours -= 1;
        }

        return { totalPasses: totalPasses, level: roundTo(level, 4) };
    }

    document.getElementById("petDetails").onsubmit = (e) => {
        e.preventDefault();
        const startLvl = Number(document.getElementById("startLvl").value);
        const endLvl = Number(document.getElementById("endLvl").value);
        const stage = Number(document.getElementById("stage").value);
        const usePremium = Boolean(document.getElementById("premium").checked);
        const useCracker = Boolean(document.getElementById("cracker").checked);
        const passType = (usePremium === true) ? " premium" : " normal";
        const ender = (useCracker === true) ? " using crackers" : "";
        const result = calcPasses(startLvl, endLvl, stage, usePremium, useCracker);
        const out = "It would take " + result.totalPasses + passType + " passes (" + result.totalPasses / Math.max(1, stage) * 12 + " hours) to level your s" + stage + " pet from " + startLvl + " to " + result.level + ender;
        document.getElementById("result").innerHTML = out;
    };
};