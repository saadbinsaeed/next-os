import Document, { Head, Main, NextScript } from 'next/document';
import stylesheet from 'bluerain-bootstrap-theme/dist/css/bluerain-bootstrap-theme.css';

export default class MyDocument extends Document {
  render () {

    return (
      <html>
        <Head>
          <title>Bluerain Next OS</title>

        </Head>
        <body>
          <div className='root'>
            <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
            <Main />
          </div>
          <NextScript />
        </body>
      </html>
    )
  }
}
