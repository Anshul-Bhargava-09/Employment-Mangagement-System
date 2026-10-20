import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import "./Card.css"

function Card({title,value,icon,suffix}) {
  return (
    <div className="stats-card">
      <div className="card-left"></div>

      <div className="card-content">
        <div>
          <h6 className="card-title">{title}</h6>
          <h2 className="card-value">{value}
            {suffix && <span className="text-muted fs-6 ">{suffix}</span>}
          </h2>
        </div>

        <div className="icon-box">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default Card;