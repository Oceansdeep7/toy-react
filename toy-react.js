const RENDER_TO_DOM = Symbol('render to dom')

export class Component {
    constructor() {
        this.props = Object.create(null)
        this.children = []
        this._root = null
        this._range = null
    }
    
    setAttribute(name, value) {
        this.props[name] = value
    }
    
    appendChild(component) {
        this.children.push(component)
    }
    
    [RENDER_TO_DOM](range) {
        this._range = range
        this.render()[RENDER_TO_DOM](range)
    }
    
    rerender() {
        let oldRange = this._range
        let range = document.createRange()
        range.setStart(oldRange.startContainer, oldRange.startOffset)
        range.setEnd(oldRange.startContainer, oldRange.startOffset)
        this[RENDER_TO_DOM](range)
        
        oldRange.setStart(range.endContainer, range.endOffset)
        oldRange.deleteContents()
    }
    
    setState(newState) {
        if (this.state === null || typeof this.state !== "object") {
            this.state = newState
            this.rerender()
            return
        }
        let merge = (oldState, newState) => {
            for (let p in newState) {
                if (oldState[p] === null || typeof oldState[p] !== "object") {
                    oldState[p] = newState[p]
                } else {
                    merge(oldState[p], newState[p])
                }
            }
        }
        merge(this.state, newState)
        this.rerender()
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    
    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    
    setAttribute(name, value) {
        if (name.match(/^on([\s\S]+)$/)) {
            this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLocaleLowerCase()), value)
        } else {
            if (name === 'className') {
                this.root.setAttribute('class', value)
            } else {
                this.root.setAttribute(name, value)
            }
        }
    }
    
    appendChild(component) {
        const range = document.createRange()
        range.setStart(this.root, this.root.childNodes.length)
        range.setEnd(this.root, this.root.childNodes.length)
        component[RENDER_TO_DOM](range)
    }
    
    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root)
    }
}

export function createElement(element, attributes, ...children) {
    let e
    if (typeof element === 'string') {
        e = new ElementWrapper(element)
    } else {
        e = new element
    }
    
    
    for (let attribute in attributes) {
        e.setAttribute(attribute, attributes[attribute])
    }
    
    const insertChildren = (children) => {
        for (let child of children) {
            if (typeof child === 'string') {
                child = new TextWrapper(child)
            }
            if (child === null) {
                continue
            }
            if (Array.isArray(child)) {
                insertChildren(child)
            } else {
                e.appendChild(child)
            }
            
        }
    }
    
    insertChildren(children)
    
    return e
}

export function render(element, root) {
    const range = document.createRange()
    range.setStart(root, 0)
    range.setEnd(root, root.childNodes.length)
    range.deleteContents();
    element[RENDER_TO_DOM](range)
}
