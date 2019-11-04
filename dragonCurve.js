const getCurve = (iterations) => {
    const curve = []

    for (let i = 1; i <= iterations; i++) {
        let size = curve.length
        curve.push(1)
        for (let j = (size - 1); j >= 0; j--) {
            curve.push(-curve[j])
        }
    }
    return curve
}
console.log(getCurve(4))
