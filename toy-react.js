export class Component {
    constructor() {
        this.props = Object.create(null)
        this.children = []
        this._root = null
    }
    
    get root() {
        if (!this._root) {
            this._root = this.render().root
        }
        return this._root
    }
    
    setAttribute(name, value) {
        this.props[name] = value
    }
    
    appendChild(component) {
        this.children.push(component)
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
}

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    
    appendChild(component) {
        this.root.appendChild(component.root)
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
    root.appendChild(element.root)
}
