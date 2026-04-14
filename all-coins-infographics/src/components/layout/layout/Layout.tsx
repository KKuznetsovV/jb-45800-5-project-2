import Header from '../header/Header'
import Main from '../main/Main'
import Footer from '../footer/Footer'
import './Layout.css'

export default function Layout() {
    return (
        <div className='Layout'>
            <header>
                <Header />
            </header>

            <main>
                <Main />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}
