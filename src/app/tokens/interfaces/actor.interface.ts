export interface Actor {
  id: number;
  name: string;
  picture: string;
  media: ActorMedia[];
}

interface ActorMedia {
  name: string;
  credits: ActorMediaCredit[];
}

interface ActorMediaCredit {
  character: string;
  episodeCount: number;
}
