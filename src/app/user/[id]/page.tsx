"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardFooter, CardBody, Divider, Button, Tooltip, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { fetchUser, fetchUserRepositories, fetchUserGists } from "@/app/utils/githubApi";
import { ChartBarSquareIcon } from "@heroicons/react/24/outline";

type Props = {
    params: { id: string }
}

export default function UserPage({ params }: Props) {
    const { data: session } = useSession();
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [userRepositories, setUserRepositories] = useState<any>(null);
    const [userGists, setUserGists] = useState<any>(null);
    const [userLanguages, setUserLanguages] = useState<any>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const getUser = async () => {
            const userData = await fetchUser(params.id);
            if(!userData) return;
            setUser(userData);
        };
        const getUserGists = async () => {
            const getUserGists = await fetchUserGists(params.id);
            setUserGists(getUserGists);
            console.log(getUserGists);
        };
        getUser();
        getUserGists();
        
    }, [params.id]);

    useEffect(() => {
        if (user && session?.user?.name === user?.name) {
            setIsOwner(true);
        }
    }, [session, user]);

    useEffect(() => {
        const getUserRepositories = async () => {
            const userRepositories = await fetchUserRepositories(params.id);
            setUserRepositories(userRepositories);
        };
        getUserRepositories();
    }, [params.id]);

    useEffect(() => {
        let languages: string[] = [];
        userRepositories?.forEach((repository: any) => {
            if (repository.language) {
                if (!languages.includes(repository.language)) {
                    languages.push(repository.language);
                }
            }
        });
        setUserLanguages(languages);
    },[userRepositories]);

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <head>
                <meta property="fc:frame" content="vNext" />


    
                <meta
                    property="fc:frame:image"
                    content={user ? `https://me-cvai.netlify.app/api/frame?userId=${user.login}` : ''}/>
                                    <meta name="fragment" content="!" />
                 <meta
                    property="og:image"
                    content={user ? `https://me-cvai.netlify.app/api/frame?userId=${user.login}` : ''}/>                                    
                <meta name="fc:frame:button:1" content="Profile" />
                <meta name="fc:frame:button:1:action" content="link" />
                <meta name="fc:frame:button:1:target" content={user ? `https://me-cvai.netlify.app/user/${user.login}` : ''} />
                <meta name="fc:frame:button:2" content="Mint" />
<meta name="fc:frame:button:2:action" content="mint" />
<meta
  name="fc:frame:button:2:target"
  content="eip155:8453:0x7a33eb3c8c2e137b7780cb175119ecb78c092448:2"
/>
                <meta property="of:accepts:xmtp" content="2024-02-01" />

                <meta property="og:title" content="Me CV.ai" />
                <meta property="og:description" content="Eliminating Technical Interviews one Profile at a Time" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={user ? `https://me-cvai.netlify.app/user/${user.login}` : ''} />
                <meta property="og:site_name" content="Me CV.ai" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@MeCVai" />
                <meta name="twitter:title" content="Me CV.ai" />
                <meta name="twitter:description" content="Eliminating Technical Interviews one Profile at a Time" />
                <meta
                    name="twitter:image"
                    content={user ? `https://me-cvai.netlify.app/api/frame?userId=${user.login}` : ''}/>

            </head>
            <>
            {!user ? (
                <div>Loading...</div>
            ) : (
                <>
                    <h1 className="font-bold text-2xl my-4">@{user.login}</h1>
                    <div className="flex flex-wrap mb-6">
                        <div className="flex items-center">
                            {userLanguages?.map((language: string) => (
                                <Chip key={language} size="lg" color="primary" className="mr-2">{language}</Chip>
                            ))}
                            {!isOwner && (
                                <span className="text-xs italic ml-2">Sign-up to scan all of your code language skills...</span>
                            )}
                            {isOwner && (
                                <span className="text-xs italic ml-2">You are the owner of this profile.</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Card shadow="sm" className="w-[380px]">
                            <CardHeader className="flex gap-3">
                            <Image className="rounded-full" src={user.avatar_url} alt={user.login} width={55} height={55} />
                            <div className="flex flex-col">
                                <h4 className="text-lg">{user.name}</h4>
                                
                                {user.company && user.company.startsWith('@') && (
                                  <span className="text-xs">
                                    <Link className="underline text-pink-500" href={`/company/${user.company.replace(/^@/, '')}`}>
                                      {user.company}
                                    </Link>
                                  </span>
                                )}
                                <span className="text-xs">{user?.location}</span>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <h3>About {user.name}:</h3>
                            {user.bio ? <p>{user.bio}</p> : <p className="text-gray-500 italic">No bio available from GitHub. Sign-up to generate one from your commit history.<br/><br/><a className="underline" href="#">Premium Account</a></p>}
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            <span className="inline-block mr-2">followers: <span className="font-bold">{user?.followers}</span></span>
                            <span className="inline-block"> following: <span className="font-bold">{user?.following}</span></span>
                        </CardFooter>
                    </Card>

                     <Card shadow="none" className="w-[400px] bg-transparent border-solid border-4 border-gray-300">
                        <CardHeader>
                            <h3 className="font-bold my-1 mr-2">Skill Level</h3>
                            <ChartBarSquareIcon className="w-6 h-6" />
                        </CardHeader>
                      
                        <CardBody>
                            {!isOwner ? (
                            <p className="text-sm">Connect GitHub to mint your skill level across many languages with a finne grained scan of every single commit in your history (including past private repos), based on <Tooltip showArrow={true} placement="bottom" content="Patterns are a model for indentifying skills in your commit history."><span className="underline text-pink-500">Patterns</span></Tooltip>.</p>
                            ) : (
                                <p className="text-sm">Begin a fine grained scan of all of your commits to determine your skill level.</p>
                            )}
                        </CardBody>
                      
                        <CardFooter>
                            {!isOwner ? (
                                <Button variant="bordered" className="w-fit">Claim Your Profile</Button>
                            ) : (
                                <Button variant="bordered" className="w-fit">Scan Your Commits</Button>
                            )}
                        </CardFooter>
                     </Card>

                     <div>
                        
                            <Card shadow="none" className="w-[400px] bg-transparent">
                                <CardBody>
                                    <CardHeader className="flex flex-col">
                                    {(!userGists || userGists?.length === 0) && (
                                        <h3 className="font-bold text-3xl">You don&apos;t even GIST, bro?</h3>
                                    )}
                                    {userGists && userGists.length > 0 && (
                                        
                                        <h3 className="font-bold text-3xl mb-2">You have gists. Want more?</h3>
                            
                                       
                                    )}
                                    </CardHeader>
           
                                    <CardBody>

                                        
                                            <p className="text-sm italic">Sign-up to indentify and feature Gists you already have in your codebase.</p>
                                        
                                    </CardBody>
                         
                                    <CardFooter className="flex justify-end">
                                        <Button className="bg-black text-white">Sign-up for Premium</Button>
                                    </CardFooter>
                                </CardBody>
                            </Card>
                        
                        
                    </div>

                    
                    </div>
                        
                    <div>
                        <h3 className="font-bold my-4">Repositories</h3>
                        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                            {userRepositories?.map((repository: any, index: number) => (
                                <Card shadow="none" isPressable={index < 4} className={`w-[250px] mb-4 ${index >= 4 && !isOwner ? 'opacity-20 z-[0]' : ''}`} key={repository.id}>
                                    <CardHeader className="flex flex-col">
                                        <h3 className="text-sm"><span className="font-bold">{repository.name}</span></h3> 
                                    </CardHeader>
                                    <Divider />
                                    <CardBody>
                                        <span className="text-sm">{repository.description}</span>
                                        {repository.language && (
                                            <Chip className="mt-2" size="sm" color="primary">{repository.language}</Chip>
                                        )}
                                    </CardBody>
                                    <Divider />
                                    <CardFooter>
                                        <div className={`${index >= 4 && !isOwner ? 'opacity-0 z-[0]' : ''}`}>
                                            <Button radius="sm" variant="bordered" className="text-xs px-0 py-0 text-gray-400" onClick={() => window.location.href = `/?username=${user.login}&repo=${repository.name}`}>Evaluate</Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))} 
                        </div>
                        {!isOwner && (
                        <div className="flex flex-col items-center mt-[-170px] z-100 relative pb-[100px]">
                            <Button onPress={onOpen} className="mb-4 bg-pink-500 text-white text-xl px-8 py-8 font-bold mb-8">Claim Your Profile</Button>
                            <p className="italic">If you have a GitHub account, connect to claim your free MeCV profile (more git options coming soon).</p>
                            <p className="italic">Once connected you can select which repositories to feature, filter, sort and much more...</p>
                        </div>
                        )}
                    </div>

                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            <ModalHeader>
                                <h3 className="font-bold text-2xl">Apply for Closed Beta</h3>
                            </ModalHeader>
                            <ModalBody>
                                <p>Apply for closed beta access to MeCV.</p>
                                <Input label="Email" />
                            </ModalBody>
                            <ModalFooter>
                                <Button>Apply for Beta</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            )}
            </>
        </div>
    );
}