
Q1 - What is the difference between Component and PureComponent? Give an example where it might break my app.

The main difference between a React **Component** and **PureComponent** is how they handle updates and re-rendering. A **React** **Component** does not perform any optimization to prevent re-rendering whenever its state or props change, which leads to performance issues in complex applications. On the other hand, **PureComponent i**mplements a **shouldComponentUpdate** method internally that performs a shallow comparison of the component's previous props and state with the new received props or state, which in most cases significantly optimizes the rendering performance of app.


In a scenerio, where using **PureComponent** might break app where complex objects or arrays are handled within props or state & as **PureComponent** uses shallow comparison, it compares object references rather than the contents of objects or arrays. This can lead to unexpected behavior if the structure of the objects or arrays changes but their references remain the same. An example,  if we pass an array of objects as a prop and modify the objects inside the array elsewhere in our app, **PureComponent** might not recognize the changes because the array reference is still the same, even though the objects within it have changed. This could cause our component to not update when it should which can lead to incorrect UI state.


To fix this issue, we can manually implement **shouldComponentUpdate or React.memo** (for functional components) in our component to perform deep comparisons when necessary. We should always create a new copy of the objects and arrays when their content changes to change their references.


## Q2 - Context + ShouldComponentUpdate might be dangerous. Why is that?

**Context** & **ShouldComponentUpdate** together can be dangerous because **ShouldComponentUpdate** does the shallow comparision of new & previous props & state to prevent unnecessary rendering. In case, if a component subscribes to a Context and using **ShouldComponentUpdate** then it is possible that the on change **Context** propogate the changed value to its subscriber component but **ShouldComponentUpdate** may return false as the props or state of the component aren’t change . Which can cause Inconsistent UI & undesired experience.


## Q3 - Describe 3 ways to pass information from a component to its PARENT.



1. **Callback Functions** - The parent component passes a function as a prop to the child component. The child component then calls this function with some data, on invocation parent receives the data and consumes.

   \
   ```
   // ParentComponent.js
   import React, { useState } from 'react';
   import ChildComponent from './ChildComponent';
   
   function ParentComponent() { 
     const [data, setData] = useState('');
   
     const handleDataFromChild = (childData) => {
       setData(childData);
     };
   
     return (
       <div>
         <h1>Data from child: {data}</h1>
         <ChildComponent sendDataToParent={handleDataFromChild} />
       </div>
     );
   }
   
   export default ParentComponent;
   
   // ChildComponent.js
   import React from 'react';
   
   function ChildComponent({ sendDataToParent }) {
     const sendData = () => {
       sendDataToParent('Hello, Parent!');
     };
   
     return (
       <div>
         <button onClick={sendData}>Send Data to Parent</button>
       </div>
     );
   }
   
   export default ChildComponent;
   ```

   \
2. **Using Context API -** The Context API allows sharing data between components without passing props through every level of the compoent tree.

   \
   ```
   // Context.js
   import React, { createContext, useState } from 'react';
   
   const DataContext = createContext();
   
   const DataProvider = ({ children }) => {
     const [data, setData] = useState('');
   
     return (
       <DataContext.Provider value={{ data, setData }}>
         {children}
       </DataContext.Provider>
     );
   };
   
   export { DataContext, DataProvider };
   
   // ParentComponent.js
   import React, { useContext } from 'react';
   import { DataContext } from './Context';
   import ChildComponent from './ChildComponent';
   
   function ParentComponent() {
     const { data } = useContext(DataContext);
   
     return (
       <div>
         <h1>Data from child: {data}</h1>
         <ChildComponent />
       </div>
     );
   }
   
   export default ParentComponent;
   
   // ChildComponent.js
   import React, { useContext } from 'react';
   import { DataContext } from './Context';
   
   function ChildComponent() {
     const { setData } = useContext(DataContext);
   
     const sendData = () => {
       setData('Hello, Parent!');
     };
   
     return (
       <div>
         <button onClick={sendData}>Send Data to Parent</button>
       </div>
     );
   }
   
   export default ChildComponent;
   
   ```

   \
3. **Refs + useImparativeHandle hook -**  Create a ref in the parent component and pass it to the child component. The child component modifies the ref value using **useImparativeHandle** and the parent component reads the updated value.


```
// ParentComponent.jsx
import React, { useRef } from 'react';
import ChildComponent from './ChildComponent';

function ParentComponent() {
  const childRef = useRef();

  const handleGetChildData = () => {
    alert(childRef.current.value);
  };

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleGetChildData}>Get Data from Child</button>
    </div>
  );
}

export default ParentComponent;

// ChildComponent.jsx
import React, { forwardRef, useImperativeHandle, useState } from 'react';

const ChildComponent = forwardRef((props, ref) => {
  const [childData, setChildData] = useState('Hello, Parent!');

  useImperativeHandle(ref, () => ({
    value: childData,
  }),[childData);

  return <div>child</div>;
});

export default ChildComponent;
```



4\. **Event emitter - In some scenerios we can use eventEmitter to pass data from child to parent by emitting the data on a event from child & can listen to that same event in parent to receive the data.**

## Q4 - Give 2 ways to prevent components from re-rendering.

**1 . React.memo**: **React.memo** is a higher-order component that performs a shallow comparison of the current and next props. If the props are identical, React skips rendering of the component &  prevents unnecessary re-renders.

* \

```
const Button = React.memo(() => { 
  console.log("Button Rendered!");
  window.alert("Button Rendered");
  return <button onClick="">Press me</button>;
});
```



2\. Using useMemo and useCallback - **useMemo** and **useCallback** are hooks used to memoize values and functions. This helps to prevent re-renders when passing functions or derived values as props.


\####### using `useMemo`

```
import React, { useMemo } from 'react';

const MyComponent = ({ items }) => {
  // Memoize a derived value
  const total = useMemo(() => {
    console.log('Calculating total');
    return items.reduce((acc, item) => acc + item.value, 0);
  }, [items]);

  return (
    <div>
      Total: {total}
    </div>
  );
};

export default MyComponent;
```


\####### using `useCallback`

```
import React, { useCallback } from 'react';

const MyComponent = ({ onClick }) => {
  console.log('MyComponent rendered');

  return (
    <button onClick={onClick}>Click me</button>
  );
};

const ParentComponent = () => {
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  return (
    <MyComponent onClick={handleClick} />
  );
};

export default ParentComponent;
```



3\. Same Origin/ Identity Reference - When a component is passed as a **children** prop to another component, a change in the state of the parent component will not automatically cause a re-render of the child component. This is because React ensures that components cannot modify their own props, and thus prevents unnecessary re-renders of child components that are passed as **children** props, as long as the reference to the children remains the same.


```
// Parent Component

import React, { usestate } from 'react' 

export const CountContext = React. createContext()
const CountProvider = CountContext. Provider

export const Parent = ({children}) => {
const [count, setCount] = useState(0)

return (
<>
    <button onClick={() =› setCount((c) => c + 1)}›Count {count}</button>
    <CountProvider value={count}›
    {children}
    </CountProvider>
</>
)


// App Component

import React from 'react' 

import Child from './Child'
import Parent from './Parent'
 
function App() {
return (
  <div className= 'App' >
    <Parent>
      <Child/> 
    </Parent>
</div>)}
```


In the example above, the **Child** component is passed as **children** and is not dependent on any props or state of the **Parent** component. As a result, when the counter value changes, the **children** prop itself does not change in the **Parent** component. The **Child** component does not re-render.

## Q5 - What is a fragment and why do we need it? Give an example where it might break my app.

A fragment in React is a way to group multiple components as single compoent without adding extra nodes to the DOM. Sometimes, we want to return multiple elements at the same level without wrapping them in an extra DOM element like a **<div>**. Adding unnecessary wrapper elements can affect structure of app layout. Fragments solve this problem by allowing us to group children without adding extra nodes.


```
import React from 'react';

function MyComponent() {
  return (
    <React.Fragment>
      <h1>Hello, world!</h1>
      <p>This is a paragraph.</p>
    </React.Fragment>
  );
}

export default MyComponent;
```


Fragments can only take the `key` and `children` props. If we pass any other props to a fragment, it will cause an error & that can break the app.

## Q6 - Give 3 examples of the HOC pattern.



1. **Authentication/Authorization HOC** - This HOC wraps around a component to ensure that only authenticated users can access it. It checks the user's authentication status and based on checks, it decides whether to render the wrapped component or redirect the user to a login page.

   \
   ```
   import React from 'react';
   
   const withAuthorization = (WrappedComponent) => {
     return class extends React.Component {
       render() {
         const { isAuthenticated, ...rest } = this.props;
         if (!isAuthenticated) {
           return <Redirect to='/login'/>;
         }
         return <WrappedComponent {...rest} />;
       }
     };
   };
   
   const ProtectedComponent = (props) => <div>Protected Content</div>;
   const ProtectedWithAuthorization = withAuthorization(ProtectedComponent)
   
   ```
2. **Data Fetching HOC (**`fetchData`): This HOC fetches data from an API and passes it as props to the wrapped component. It can also handle loading states and errors gracefully.

   ```
   import React from 'react';
   
   const withDataFetching = (url) => (WrappedComponent) => {
     return class extends React.Component {
       state = { data: null, loading: true, error: null };
   
       componentDidMount() {
         fetch(ur
           .then(response => response.json())
           .then(data => this.setState({ data, loading: false }))
           .catch(error => this.setState({ error, loading: false }));
       }
   
       render() {
         const { data, loading, error } = this.state;
         if (loading) return <div>Loading...</div>;
         if (error) return <div>Error: {error.message}</div>;
         return <WrappedComponent data={data} {...this.props} />;
       }
     };
   };
   
   const DataDisplay = ({ data }) => <div>{JSON.stringify(data)}</div>;
   const DataDisplayWithFetching = withDataFetching('https://api.example.com/data')(DataDisplay);
   
   ```

   \
3. **Theme Provider -** A HOC to inject theme-related props into a component.

   ```
   import React from 'react';
   
   const withTheme = (WrappedComponent) => {
     return class extends React.Component {
       render() {
         const theme = { color: 'blue', background: 'lightgrey' };
         return <WrappedComponent theme={theme} {...this.props} />;
       }
     };
   };
   
   const ThemedComponent = ({ theme }) => (
     <div style={{ color: theme.color, background: theme.background }}>
       Themed Content
     </div>
   );
   const ThemedComponentWithTheme = withTheme(ThemedComponent);
   
   
   ```


## Q7 - What's the difference in handling exceptions in promises, callbacks and async…await?

Handling exceptions in Promises, callbacks, and async-await differs in terms of syntax and approach, but the underlying concept of error handling remains consistent.

* Promises: Errors in Promises are handled using **.catch()** method. When a promise is rejected, the **.catch()** method attached to the promise chain is called & it captures error.
* Callbacks: Errors in callbacks are typically captured by checking at the error argument.
* Async/Await: When using async/await, we use try/catch blocks to handle exceptions. async/await offers  advantages in terms of readability and error handling.

  \

## Q8 - How many arguments does setState take and why is it async.

**setState** in React accepts up to two arguments. The first argument is either an object or a function that defines how the state should be updated. The second argument is a callback function that is executed after the state update has been completed and the component has been re-rendered. This asynchronous nature of **setState**  optimizes the rendering performance by batching multiple state updates together and applying them in a single render cycle.

## Q9 - List the steps needed to migrate a Class to Function Component.



1. Change the class definition to a function. Replace Class Components with function Component.

2\. Remove the Render Method, Constructor & references to this.

3\. Convert all **c**lass methods to regular functions within the function component.

4\.  Replace **this.state** and **this.setState** & lifecycle methods with **useEffect** and **useState** Hooks for State and Side Effects.

## Q10 - List a few ways styles can be used with components.



1. stylesheet - Use regular style sheet. import it in any component & use in className or id attribute.
2. Inline styles - Define styles directly in JSX on emelents using the style attribute & pass the style in form of an object.
3. CSS Modules - Import and use CSS within component. It can be passed in attributes like className by using object’s propoerty access pattern. These styles are locally scoped & avoids conflicts with parent css classes.  It can be create by follwing **Header.module.css** naming convention
4. CSS in JS : Use a library like **styled-components** to define component-specific styles using tagged template literals in JavaScript.


## Q11 - How to render an HTML string coming from the server

To render an HTML string coming from the server in a React application, we can use the **dangerouslySetInnerHTML** attribute. This attribute allows us to add raw HTML into a component but bypasses the React's normal escaping process. Inserting a roaw html string directly into doc can lead to security issues such as the risk of cross-site scripting (XSS) attacks. We can use the html sanitization library **DomPurify** to sanitize before passing & prevent the XSS.


```
function MyComponent({ htmlString }) {
  return <div dangerouslySetInnerHTML={{ __html: "<p>Hello</p>" }}/>;
}
```


