let NavMenu = React.createClass({
    render: function() {
        return (
            React.createElement('ul', {className: 'nav-menu'},
                    
                React.createElement('li', {},
                    React.createElement('a', {href: '#'}, 'Contact List')
                ),
                React.createElement('li', {},
                    React.createElement('a', {href: '#newitem'}, 'Add New Contact')
                )
            )
        );
    }
});

var ListItem = React.createClass({
    propTypes: {
        id: React.PropTypes.number,
        name: React.PropTypes.string,
        email: React.PropTypes.string,
        onDeleteButtonClicked: React.PropTypes.func
    },
        
    render: function(){
        return (
            React.createElement('li', {},
                React.createElement('a', {href:'#item/' + this.props.id}, this.props.name),
                    
                React.createElement('button', {
                    id: 'item-' + this.props.id,
                    onClick: this.props.onDeleteButtonClicked
                }, 'X')
            )
        );
    }
});

let MainPage = React.createClass({
    render: function () {
        return (
            React.createElement('div', {},
                React.createElement(NavMenu, {}),
                React.createElement('div', {}), 
                React.createElement(List, state)
            )
        );
    }
});

// ITEM LIST PAGE
let List = React.createClass({
    propTypes: {
        items: React.PropTypes.array
    },
    render: function() {

        var self = this;

        var listItems = this.props.items.map(function(item){

            item.onDeleteButtonClicked = self.props.onItemDeleted;

            return React.createElement(ListItem, item);
        });

        return (
               
            React.createElement('div', {},
                    
                React.createElement('ul', {}, listItems)
            )
        );
    }
});


let ItemPage = React.createClass({
    render: function() {
        return (
            React.createElement('div', {},
                React.createElement(NavMenu, {}),
                React.createElement('h2', {}, this.props.name),
                React.createElement('p', {}, this.props.email)
            )
        );
    }
});

let AddNewForm = React.createClass({
    propTypes: {
        listItem: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onSubmit: React.PropTypes.func.isRequired
    },
    onNameChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {name: e.target.value}));
    },
    onEmailChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {email: e.target.value}));
    },
    onSubmit: function() {
        this.props.onSubmit(this.props.listItem);
    },
    render: function() {
        return (
            React.createElement('form', {},
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Name',
                    value: this.props.listItem.name,
                    onChange: this.onNameChange
                }),
                React.createElement('textarea', {
                    placeholder: 'Email',
                    value: this.props.listItem.email,
                    onChange: this.onEmailChange
                }),
                React.createElement('button', {type: 'button', onClick: this.onSubmit}, 'Submit')
            )
        );
    }
});
let FormView = React.createClass({
    propTypes: {
        listItem: React.PropTypes.object.isRequired,
        items: React.PropTypes.array.isRequired,
        onNewListItemChange: React.PropTypes.func.isRequired,
        onSubmitNewItem: React.PropTypes.func.isRequired
    },
    render: function() {
        return (
            React.createElement('div', {},
                    
                    
                React.createElement(AddNewForm, {listItem: this.props.listItem, onChange: this.props.onNewListItemChange, onSubmit: this.props.onSubmitNewItem})
            )
        );
    }
});


let AddNewListItemPage = React.createClass({
   
    render: function() {
        return (
        
            React.createElement('div', {},
                React.createElement(NavMenu, {}),
                React.createElement(FormView,
                    Object.assign({}, state, {
                        onNewListItemChange: updateNewListItem,
                        onSubmitNewItem: addNewItem
                    }))
            
            )
        );
    }
    
});


function updateNewListItem(item) {
    setState({listItem: item});
}
function addNewItem(item) {
    let itemList = state.items;
    
    var index = 0;
    
    try{
        index = state.items[state.items.length-1].id;
    }
    catch(e){
        index = 0;
    }
    
    itemList.push(Object.assign({}, {key: index + 1, id: index + 1}, item));
    setState({listItem:{name: '', email: ''},items: itemList});
    //console.log("New Item List: ", state.items);
}

let state = {
    location: 'display'
};

function setState(changes) {
    
        
    state = Object.assign({}, state, changes);
    
    let splittedUrl = state.location.replace(/^#\/?|\/$/g, '').split('/');

    state.onItemDeleted = function(e) {

        // turns 'item-1' to '1'
        var itemId = e.target.id.split('-')[1];

        var newListOfItems = [];

        for(var i = 0; i < state.items.length; i++){
            if(state.items[i].id != itemId){
                newListOfItems.push(state.items[i]);
            }
        }

        setState({location: location.hash, items: newListOfItems});
    };

    let component;
    let componentProperties = {};
    Object.assign(state, changes);
    switch(splittedUrl[0]) {
    case 'newitem':
        component = AddNewListItemPage;
        break;
    case 'item':
        component = ItemPage;
        componentProperties = items.find(i => i.key == splittedUrl[1]);
        break;
    default:
        component = MainPage;
    }
    

    
    ReactDOM.render(React.createElement(component, componentProperties), document.getElementById('react-app'));
    

}

window.addEventListener('hashchange', ()=>setState({location: location.hash}));

//Start the app by declaring the initial state
setState({listItem:{
    name: '',
    email: ''
}, location: location.hash, items: items});