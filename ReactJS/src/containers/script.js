const Login = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className={`container ${isActive ? 'active' : ''}`}>

            <button onClick={() => setIsActive(true)}>Sign Up</button>
            <button onClick={() => setIsActive(false)}>Sign In</button>

        </div>
    );
};