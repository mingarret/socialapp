import { insertLike } from "../lib/action"
import { HeartIcon } from "@heroicons/react/24/outline"
export default ({ post_id, user_id }) =>{


    const insertLikePostYUser = insertLike.bind(null, post_id, user_id)

    return(

        <HeartIcon onClick={insertLikePostYUser()} className="h-6  w-6" />
    )
}