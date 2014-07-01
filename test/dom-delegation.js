var test = require("tape")
var setImmediate = require("timers").setImmediate
var document = require("global/document")

var h = require("./lib/h.js")
var createEvent = require("./lib/create-event.js")

var addEvent = require("../add-event.js")
var Delegator = require("../index.js")

test("delegated listeners are called", function (assert) {
    var parent = h("div", [ h("div") ])
    var child = parent.childNodes[0]
    document.body.appendChild(parent)

    Delegator()
    var values = []

    function fn(ev) {
        values.push(ev)
    }

    addEvent(parent, "click", fn)
    addEvent(child, "click", fn)

    var ev = createEvent("click")
    child.dispatchEvent(ev)

    setImmediate(function () {
        assert.equal(values.length, 2)
        assert.equal(values[0].currentTarget, child)
        assert.equal(values[1].currentTarget, parent)

        document.body.removeChild(parent)
        assert.end()
    })
})

test("all handler does not prevent delegation", function (assert) {
    var parent = h("div", [ h("div") ])
    var child = parent.childNodes[0]
    document.body.appendChild(parent)

    Delegator()
    var values = []

    function fn(ev) {
        values.push(ev)
    }

    addEvent(parent, "click", fn)
    addEvent(child, "event", fn)

    var ev = createEvent("click")
    child.dispatchEvent(ev)

    setImmediate(function () {
        assert.equal(values.length, 2)
        assert.equal(values[0].currentTarget, child)
        assert.equal(values[1].currentTarget, parent)

        document.body.removeChild(parent)
        assert.end()
    })
})
