import stylesheet from 'bluerain-bootstrap-theme/dist/css/bluerain-bootstrap-theme.css';


class Layout extends React.Component{

  render() {

    return(
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div>
          {this.props.children}
        </div>
      </div>

    );
  }
}

export default Layout;
